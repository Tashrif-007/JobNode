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

          // PDF Header - Company Name and title
          doc.fontSize(18).text(company.name, { align: 'left', font: 'Helvetica-Bold' });
          doc.fontSize(12).text(company.address, { align: 'left' });
          doc.moveDown();
          doc.text('--------------------------------------------------------', { align: 'center' });
          doc.moveDown();
          doc.fontSize(22).text('Job Offer Letter', { align: 'center', font: 'Helvetica-Bold' });
          doc.text('--------------------------------------------------------', { align: 'center' });
          doc.moveDown(2);

          // Salutation
          doc.fontSize(14).text(`Dear ${jobSeeker.name},`, { align: 'left' });
          doc.moveDown();

          // Introduction and Offer Details
          doc.fontSize(12).text('Congratulations! We are pleased to offer you the position of:', { align: 'left' });
          doc.moveDown();
          doc.fontSize(14).text(`${jobPost.position}`, { align: 'left', font: 'Helvetica-Bold' });
          doc.moveDown();

          // Salary Details
          doc.fontSize(12).text('Position at our company', { align: 'left' });
          doc.fontSize(14).text(`Salary: ${jobPost.salary}`, { align: 'left', font: 'Helvetica-Bold' });
          doc.moveDown();
          
          // Details of Employment
          doc.fontSize(12).text('Start Date: ________________', { align: 'left' });
          doc.fontSize(12).text('Job Location: ________________', { align: 'left' });
          doc.moveDown(2);

          // Acceptance and Next Steps
          doc.fontSize(12).text('Please sign and return this offer letter to confirm your acceptance.', { align: 'left' });
          doc.moveDown();

          // Closing
          doc.text('We look forward to welcoming you to our team at ' + company.name + '!');
          doc.moveDown();
          doc.fontSize(12).text('Sincerely,', { align: 'left' });
          doc.fontSize(14).text(company.name, { align: 'left', font: 'Helvetica-Bold' });
          doc.fontSize(12).text(company.contactInfo, { align: 'left' });

          // Signature space
          doc.moveDown(3);
          doc.text('-------------------------------', { align: 'left' });
          doc.text('Employee Signature', { align: 'left' });

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

import nodemailer from 'nodemailer';

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

        // Sending Offer Letter via Email
        const mailOptions = {
            from: `"JobNode" <${process.env.EMAIL_USER}>`,
            to: jobSeeker.email, // Send to job seeker email
            subject: 'Job Offer from ' + company.name,
            html: `
                <p>Hello ${jobSeeker.name},</p>
                <p>We are pleased to inform you that you have been selected for the position of ${application.jobPost.position} at ${company.name}. Please find attached the official offer letter.</p>
                <p>Congratulations!</p>
                <p>Sincerely,</p>
                <p>${company.name}</p>
            `,
            attachments: [
                {
                    filename: `offer_letter_${Date.now()}.pdf`,
                    path: offerPath, // The path to the generated PDF
                    contentType: 'application/pdf'
                }
            ]
        };

        // Create a transporter using your SMTP configuration
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email
        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'Offer created and email sent successfully', offer });

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
