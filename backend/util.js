import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

async function importData() {
  const data = [];
  // Read and parse CSV file
  fs.createReadStream(path.join(__dirname, 'jobseekers_dataset.csv'))
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', async () => {
      for (const row of data) {
        const {
          jobseeker_id,
          name,
          email,
          password,
          userType,
          salaryExpectation,
          experience,
          skills,
          location,
          position,
        } = row;

        try {
          // Insert into User table
          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              userType,
            },
          });

          // Insert into JobSeeker table
          const jobSeeker = await prisma.jobSeeker.create({
            data: {
              userId: user.id, // Foreign key from the User table
              salaryExpectation: parseFloat(salaryExpectation), 
              experience: parseInt(experience, 10),
              location,
              experienceName: position, // Assuming position corresponds to experienceName
            },
          });

          // Process skills and insert them into the database
          const skillList = skills.split(' ').map((skill) => skill.trim());

          for (const skill of skillList) {
            let existingSkill = await prisma.skills.findUnique({
              where: { name: skill },
            });

            if (!existingSkill) {
              existingSkill = await prisma.skills.create({
                data: { name: skill },
              });
            }

            // Insert the jobSeekerReqSkills relationship
            await prisma.jobSeekerReqSkills.create({
              data: {
                jobSeekerId: jobSeeker.id,
                skillId: existingSkill.id,
              },
            });
          }

          console.log(`Data imported for ${name} (${jobseeker_id})`);

        } catch (error) {
          console.error(`Error inserting data for ${name} (${jobseeker_id}):`, error);
        }
      }

      console.log('Data import completed!');
      await prisma.$disconnect();
    });
}

importData();
