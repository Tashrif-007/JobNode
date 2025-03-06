import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    // Input Data
    const jobSeekerData = {
      userId: 5, // Replace with your userId
      salaryExpectation: 2800.0, // Optional
      location: 'Gulshan', // Optional
      experience: 5, // Optional
      experienceName: 'Software Developer', // Optional
      requiredSkills: [8,9,7], // Array of skill IDs
    };

    // Insert JobSeeker
    const jobSeeker = await prisma.jobSeeker.create({
      data: {
        userId: jobSeekerData.userId,
        salaryExpectation: jobSeekerData.salaryExpectation,
        location: jobSeekerData.location,
        experience: jobSeekerData.experience,
        experienceName: jobSeekerData.experienceName,
      },
    });

    console.log('JobSeeker Inserted:', jobSeeker);

    // Insert Required Skills
    for (let skillId of jobSeekerData.requiredSkills) {
      await prisma.jobSeekerReqSkills.create({
        data: {
          jobSeekerId: jobSeeker.id,
          skillId: skillId,
        },
      });
    }

    console.log('JobSeeker Skills Inserted Successfully');
  } catch (error) {
    console.error('Error inserting JobSeeker:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();