import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const createPost = async (req, res) => {
  try {
    const { name, position, salary, experience, location } = req.body;

    // Validate input
    if (!position || !salary || !experience || !location || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create the job post in the database
    const jobPost = await prisma.JobPost.create({
      data: {
        name,
        position,
        salary,
        experience,
        location,
      },
    });

    res.status(201).json(jobPost);
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      // Unique constraint violation on the name field
      return res.status(409).json({ error: 'Job post with this name already exists' });
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllPost = async (req, res) => {
    try {
        const jobPosts = await prisma.JobPost.findMany();

        res.status(200).json(jobPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal server error"});
    }
};