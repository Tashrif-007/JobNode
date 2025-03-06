const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function insertJobPosts() {
    const jobPosts = [];
    
    fs.createReadStream('job_posts.csv')  // Path to your CSV file
        .pipe(csv())
        .on('data', (row) => {
            jobPosts.push(row);
        })
        .on('end', async () => {
            for (const job of jobPosts) {
                // Parsing and formatting the deadline field
                const deadline = job.deadline ? new Date(job.deadline) : null;
                
                // Create JobPost record (without upsert)
                const newJobPost = await prisma.jobPost.create({
                    data: {
                        jobPostId: parseInt(job.JobId), // Job ID
                        name: job.Name,                  // Job Name
                        position: job.Position,          // Position
                        salary: parseFloat(job['Salary Range']), // Salary
                        experience: parseInt(job.Experience),    // Experience
                        location: job.location,          // Location
                        deadline: deadline,              // Deadline (optional)
                        userId: parseInt(job.UserId),    // Company/User ID
                    },
                });

                // Handle skills
                const skillNames = job.Skills.split(',').map(s => s.trim());
                for (const skillName of skillNames) {
                    // Upsert the skill into the Skills table
                    const skill = await prisma.skills.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName },
                    });

                    // Create the relationship between JobPost and Skills
                    await prisma.jobPostReqSkills.create({
                        data: {
                            jobPostId: newJobPost.id,
                            skillId: skill.id,
                        },
                    });
                }
            }
            console.log('Job posts and skills insertion complete!');
            await prisma.$disconnect();
        });
}

insertJobPosts().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
