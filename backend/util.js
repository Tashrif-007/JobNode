const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function insertJobSeekers() {
    const users = [];
    
    fs.createReadStream('job_seekers_with_location.csv')
        .pipe(csv())
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', async () => {
            for (const user of users) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Insert into User table
                const newUser = await prisma.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        password: hashedPassword,
                        userType: 'JobSeeker',
                    },
                });

                // Insert into JobSeeker table
                const jobSeeker = await prisma.jobSeeker.create({
                    data: {
                        userId: user.jobseeker_id,
                        salaryExpectation: parseFloat(user.expected_salary),
                        location: user.location,
                        experience: parseInt(user.experience),
                        experienceName: `${user.experience} years`,
                    },
                });

                // Handle skills
                const skillNames = user.skills.split(',').map(s => s.trim());
                for (const skillName of skillNames) {
                    const skill = await prisma.skills.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName },
                    });

                    await prisma.jobSeekerReqSkills.create({
                        data: {
                            jobSeekerId: jobSeeker.id,
                            skillId: skill.id,
                        },
                    });
                }
            }
            console.log('Data insertion complete!');
            await prisma.$disconnect();
        });
}

insertJobSeekers().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
