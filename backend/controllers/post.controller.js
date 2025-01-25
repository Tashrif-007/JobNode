import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    
    if (decoded.userType !== 'Company') {
      return res.status(403).json({ error: "Permission denied" });
    }

    const userId = decoded.userId;

    const { name, position, salary, experience, location, skills } = req.body;

    if (!position || !salary || !experience || !location || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'At least one skill is required' });
    }

    const skillRecords = await Promise.all(
      skills.map(async (skillName) => {
        try {
          const skill = await prisma.skills.upsert({
            where: { name: skillName },
            update: {}, 
            create: { name: skillName },
          });
          return skill;
        } catch (err) {
          console.error(`Error upserting skill: ${skillName}`, err);
          throw new Error('Error upserting skill');
        }
      })
    );

    const jobPost = await prisma.jobPost.create({
      data: {
        name,
        position,
        salary: parseFloat(salary),
        experience: parseInt(experience),
        location,
        userId, 
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
        user: true, 
      },
    });

    res.status(200).json(jobPosts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        user: true, 
      },
    });

    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    res.status(200).json(jobPost);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
