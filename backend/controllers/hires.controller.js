import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const hire = async (req, res) => {
    try {
      const { jobSeekerId, companyId } = req.body;
  
      // Check if the hire record already exists
      const existingHire = await prisma.hires.findUnique({
        where: { jobSeekerId_companyId: { jobSeekerId, companyId } },
      });
  
      if (existingHire) {
        return res.status(400).json({ message: "This job seeker is already hired by this company." });
      }
  
      // Create a new hire record
      const newHire = await prisma.hires.create({
        data: {
          jobSeekerId,
          companyId,
        },
      });
  
      res.status(201).json(newHire);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while hiring." });
    }
  };


  export const getHires = async (req, res) => {
    try {
      const { companyId } = req.params;
  
      // Fetch all hires for the given companyId
      const hires = await prisma.hires.findMany({
        where: {
          companyId: parseInt(companyId),  // Match the companyId
        },
        include: {
          jobSeeker: {  // Include jobSeeker details
            include: {
              // Include the user details (e.g., name, email)
              // Add jobPosts the jobSeeker has applied for
              applications: {
                include: {
                  jobPost: true, // Include the job post the job seeker applied to
                }
              },
            },
          },
          company: true,    // Include company details
        },
      });
  
      // If no hires are found
      if (hires.length === 0) {
        return res.status(404).json({ message: "No hires found for this company." });
      }
  
      res.status(200).json(hires);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching the hires." });
    }
  };
  