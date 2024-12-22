import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

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