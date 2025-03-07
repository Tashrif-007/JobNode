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