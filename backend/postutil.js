import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const getRandomUserId = () => Math.floor(Math.random() * (38 - 33 + 1)) + 33;
async function insertJobPosts() {
    const jobPosts = [];
    
    fs.createReadStream('post.csv')  // Path to your CSV file
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
                        jobPostId: job['Job Id'], // Job ID
                        name: job['Job Title'],                  // Job Name
                        position: job['Job Title'],          // Position
                        salary: parseFloat(job['min_salary']), // Salary
                        experience: parseInt(job.experience),    // Experience
                        location: job.location,          // Location
                        deadline: deadline,              // Deadline (optional)
                        userId: getRandomUserId(),    // Company/User ID
                    },
                });

                // Handle skills
                const skillNames = job.skills.split(' ').map(s => s.trim());
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
