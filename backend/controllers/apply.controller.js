import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyToPost = async (req, res) => {
    try {
      const { userId, jobPostId, cvPath } = req.body;
  
      // Validate input
      if (!userId || !jobPostId || !cvPath) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create or update the application
      const application = await prisma.apply.create({
        data: {
          userId,
          jobPostId,
          cvPath,
          status: 'Pending', // Default status
        },
      });
  
      res.status(201).json(application);
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('userId_jobPostId')) {
        return res.status(409).json({ error: 'You have already applied for this job' });
      }
  
      console.error(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };