import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const prisma = new PrismaClient();

export const register = async (req,res) => {
    try {
        const {email,name,password} = req.body;

        if(!email || !name || !password) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }
        const exist = await prisma.User.findUnique({
            where: {email},
        });

        if(exist) {
            return res.status(400).json({error: "User already exists."});
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await prisma.User.create({
            data: {
                email,
                name,
                password: hashed,
            },
        });

        res.status(201).json({message: "User created successfully."});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Server error."});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email using Prisma
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password with the stored hash using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the token back to the client
        res.status(200).json({
            message: 'Login successful',
            token,  // Send the token to the client
            user: {
                email: user.email,
                name: user.name,
                id: user.id,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

export const sendMail = async (req,res) => {
    try {
        const {email} = req.body;

        if(!email) {
            return res.status(400).json({message: 'Please provide your email address.'});
        }

        const user = await prisma.User.findUnique({
            where: {email},
        });

        if(!user) {
            return res.status(404).json({message: 'User not found.'});
        }

        const resetToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '10m'
            }
        )

        const mailOptions = {
            from: `"JobNode" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Password",
            html: `
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a>
                <p>This link is valid for 15 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({message: 'Reset password email sent successfully.'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Failed to send reset password email.'});
    }
};

export const resetPassword = async (req,res) => {
    try {
        const {token, newPassword} = req.body;

        if(!token || !newPassword) {
            return res.status(400).json({message: 'Please provide a token and new password.'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.User.findUnique({
            where: {id: decoded.userId}
        });

        if(!user) {
            return res.status(404).json({message: 'User not found.'});
        }
        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.User.update({
            where: {id:user.id},
            data: {password: hashed}
        });

        res.status(200).json({message: 'Password updated successfully.'});
    } catch (error) {
        console.error(error.message);
        if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Invalid or expired token'});
        }
        res.status(500).json({message: 'Server error, please try again later.'});
    }
}