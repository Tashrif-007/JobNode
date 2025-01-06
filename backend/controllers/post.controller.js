import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { name, position, salary, experience, location, skills } = req.body;

    // Validate input
    if (!position || !salary || !experience || !location || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'At least one skill is required' });
    }

    // Create or find skills
    const skillRecords = await Promise.all(
      skills.map(async (skillName) => {
        try {
          const skill = await prisma.skills.upsert({
            where: { name: skillName },
            update: {},  // No update needed, we only want to ensure the skill exists
            create: { name: skillName },
          });
          return skill;
        } catch (err) {
          console.error(`Error upserting skill: ${skillName}`, err);
          throw new Error('Error upserting skill');
        }
      })
    );

    // Create the job post with required skills
    const jobPost = await prisma.jobPost.create({
      data: {
        name,
        position,
        salary: parseFloat(salary),
        experience: parseInt(experience),
        location,
        requiredSkills: {
          create: skillRecords.map((skill) => ({
            skillId: skill.id,
          })),
        },
      },
      include: {
        requiredSkills: {
          include: { skill: true },
        },
      },
    });

    res.status(201).json(jobPost);
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      return res.status(409).json({ error: 'Job post with this name already exists' });
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const jobPosts = await prisma.jobPost.findMany({
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
    

    res.status(200).json(jobPosts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
