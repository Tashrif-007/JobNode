import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const applyToPost = async (req, res) => {
  const { userId } = req.body; // User ID from request body
  const { id: jobPostId } = req.params; // Job post ID from route
  const cvPath = req.file?.path; // CV file path from Multer
  const {status} = req.body;
  try {

    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

    if(decoded.userType!=='JobSeeker') {
      return res.status(403).json({error: "Permission denied"});
    }
    if (!cvPath) {
      return res.status(400).json({ error: "CV file is required" });
    }
    //console.log(userId);
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

export const getApplicationsByCompany = async (req, res) => {
  const { userId } = req.params;  // Retrieve companyId (userId) from URL params
  try {
    // Fetch job posts for the given companyId (using userId instead of companyId)
    const jobPosts = await prisma.jobPost.findMany({
      where: {
        userId: parseInt(userId),  // Use userId to match the company (companyId is now userId)
      },
      include: {
        applications: {
          include: {
            user: true, // Include the user (job seeker) who applied
          },
        },
      },
    });

    // If no job posts found, send 404
    if (jobPosts.length === 0) {
      return res.status(404).json({ error: 'No job posts found for this company' });
    }

    // Collect all applications related to the job posts of the company
    const applications = jobPosts.reduce((acc, jobPost) => {
      return [
        ...acc,
        ...jobPost.applications.map((application) => ({
          applicationId: application.applicationId,
          userId: application.userId,
          status: application.status,
          cvPath: application.cvPath,
          dateCreated: application.dateCreated,
          jobPost: {
            jobPostId: jobPost.id,
            jobPostName: jobPost.name,
            position: jobPost.position,
            salary: jobPost.salary,
            experience: jobPost.experience,
            location: jobPost.location,
          },
        })),
      ];
    }, []);

    // Return the applications with job post details for the company
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
