import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyToPost = async (req, res) => {
  const { userId } = req.body; // User ID from request body
  const { id: jobPostId } = req.params; // Job post ID from route
  const cvPath = req.file?.path; // CV file path from Multer
  const {status} = req.body;
  try {
    if (!cvPath) {
      return res.status(400).json({ error: "CV file is required" });
    }
    console.log(userId);
    // Save application to the database
    const application = await prisma.apply.create({
      data: {
        userId: parseInt(userId),
        jobPostId: parseInt(jobPostId),
        cvPath,
        status,
      },
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicationsById = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters
  console.log(userId);
  try {
    // Fetch all applications for the given userId
    const applications = await prisma.apply.findMany({
      where: {
        userId: parseInt(userId), // Filter by userId
      },
      include: {
        jobPost: true, // Optionally include job post details in the response
      },
    });

    // Check if no applications are found for the given userId
    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this user" });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};