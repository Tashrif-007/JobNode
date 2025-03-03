import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateOfferLetter = async (jobSeeker, company, jobPost) => {
    return new Promise((resolve, reject) => {
        try {
            const uploadsFolder = path.join(__dirname, '../middlewares/uploads');

            if (!fs.existsSync(uploadsFolder)) {
                fs.mkdirSync(uploadsFolder, { recursive: true });
            }

            const fileName = `offer_letter_${Date.now()}.pdf`;
            const filePath = path.join(uploadsFolder, fileName);

            const doc = new PDFDocument();
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // PDF Content
            doc.fontSize(20).text('Job Offer Letter', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Dear ${jobSeeker.name},`);
            doc.moveDown();
            doc.text(`Congratulations!`);
            doc.text(`You have been selected for the position of **${jobPost.position}** at **${company.name}**.`);
            doc.text(`Your expected salary will be **${jobPost.salary}**.`);
            doc.moveDown();
            doc.text('We are excited to welcome you to our team.');
            doc.moveDown();
            doc.text('Sincerely,');
            doc.text(company.name);
            doc.end();

            stream.on('finish', () => {
                resolve(`middlewares/uploads/${fileName}`);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    });
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendOfferLetter = async (req, res) => {
    try {
        const { jobSeekerId, companyId, status, applicationId } = req.body;

        if (!jobSeekerId || !companyId || !status || !applicationId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const jobSeeker = await prisma.user.findUnique({
            where: { id: parseInt(jobSeekerId) }
        });

        const company = await prisma.user.findUnique({
            where: { id: parseInt(companyId) }
        });

        const application = await prisma.apply.findUnique({
            where: { applicationId: parseInt(applicationId) },
            include: {
                jobPost: true
            }
        });

        if (!jobSeeker || !company || !application) {
            return res.status(404).json({ message: 'Invalid JobSeeker, Company, or Application' });
        }

        // Generate PDF Offer Letter
        const offerPath = await generateOfferLetter(jobSeeker, company, application.jobPost);

        // Store Offer in Database
        const offer = await prisma.offers.create({
            data: {
                jobSeekerId: parseInt(jobSeekerId),
                companyId: parseInt(companyId),
                applicationId: applicationId,
                status,
                offerLetterPath: offerPath
            }
        });

        return res.status(201).json({ message: 'Offer created successfully', offer });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// offerController.js

export const getOfferById = async (req, res) => {
  const { jobSeekerId } = req.params;

  try {
    // Fetch offers for a specific jobSeekerId
    const offers = await prisma.offers.findMany({
      where: {
        jobSeekerId: parseInt(jobSeekerId),
      },
      include: {
        application: true,  // Include application details if necessary
        company: true,      // Include company details if necessary
      },
    });

    if (offers.length === 0) {
      return res.status(404).json({ message: "No offers found for this Job Seeker" });
    }

    return res.status(200).json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOfferStatus = async (req, res) => {
  const { offerId } = req.params;
  const { status } = req.body;

  try {
    // Validate if the status is allowed
    const allowedStatuses = ['Pending', 'Accepted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find application by ID
    const offer = await prisma.offers.findUnique({
      where: { offerId: parseInt(offerId) },
    });

    if (!offer) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update status
    const updatedOffer = await prisma.offers.update({
      where: { offerId: parseInt(offerId) },
      data: { status },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
