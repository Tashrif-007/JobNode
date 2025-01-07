import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyToPost = async (req, res) => {
  const { userId } = req.body; // User ID from request body
  const { id: jobPostId } = req.params; // Job post ID from route
  const cvPath = req.file?.path; // CV file path from Multer

  try {
    if (!cvPath) {
      return res.status(400).json({ error: "CV file is required" });
    }

    // Save application to the database
    const application = await prisma.apply.create({
      data: {
        userId: parseInt(userId),
        jobPostId: parseInt(jobPostId),
        cvPath,
      },
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};