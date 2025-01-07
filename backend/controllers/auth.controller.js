import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Registration for both JobSeeker and Company
export const register = async (req, res) => {
    try {
      const { email, name, password, userType } = req.body;
  
      // Validate input fields
      if (!email || !name || !password || !userType) {
        return res.status(400).json({ message: 'Please provide all required fields: email, name, password, and userType.' });
      }
  
      if (userType !== 'JobSeeker' && userType !== 'Company') {
        return res.status(400).json({ message: 'Invalid userType. It must be either "JobSeeker" or "Company".' });
      }
  
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user without JobSeeker or Company data
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          userType,
        },
      });
  
      res.status(201).json({
        message: 'User created successfully.',
        user: { id: newUser.id, email: newUser.email, userType: newUser.userType },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error.' });
    }
  };
  
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

export const sendMail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide your email address.' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const resetToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        const mailOptions = {
            from: `"JobNode" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Password',
            html: `
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Password</a>
                <p>This link is valid for 10 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset password email sent successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to send reset password email.' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Please provide a token and new password.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                jobSeeker: true,
                company: true,
            },
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error.' });
    }
};
