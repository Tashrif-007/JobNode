import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename  = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const applyToPost = async (req, res) => {
  const { userId } = req.body; 
  const { id: jobPostId } = req.params; 
  const cvPath = req.file?.path; 
  const {status} = req.body;
  try {

    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

    if(decoded.userType!=='JobSeeker') {
      return res.status(403).json({error: "Permission denied"});
    }
    if (!cvPath) {
      return res.status(400).json({ error: "CV file is required" });
    }

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
  const { userId } = req.params; 
  try {
    const applications = await prisma.apply.findMany({
      where: {
        userId: parseInt(userId), 
      },
      include: {
        jobPost: true, 
      },
    });

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
  const { userId } = req.params; 
  try {
    const jobPosts = await prisma.jobPost.findMany({
      where: {
        userId: parseInt(userId),  
      },
      include: {
        applications: {
          include: {
            user: true, 
          },
        },
      },
    });

    if (jobPosts.length === 0) {
      return res.status(404).json({ error: 'No job posts found for this company' });
    }

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

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const downloadCV = async (req,res) => {
  const {filename} = req.params;
  const filePath = path.join(__dirname, "..", "middlewares/uploads", filename);

  res.download(filePath, filename, (err)=> {
    if(err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  })
}
