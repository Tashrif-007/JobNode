import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const sendMessage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            return res.status(401).json({message: "Unauthorized access"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.userId;
        const { message} = req.body; // Extract senderId from request body
        const { id: receiverId } = req.params;

        if (!message || !senderId || !receiverId) {
            return res.status(400).json({ error: "Sender ID, Receiver ID, and message content are required" });
        }

        // Ensure IDs are integers
        const sender = parseInt(senderId);
        const receiver = parseInt(receiverId);

        if (sender === receiver) {
            return res.status(400).json({ error: "Sender and Receiver cannot be the same" });
        }

        // Check if a conversation exists between sender and receiver
        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { user1: sender, user2: receiver },
                    { user1: receiver, user2: sender }
                ]
            }
        });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    user1: sender,
                    user2: receiver,
                }
            });
        }

        // Create a new message
        const newMessage = await prisma.message.create({
            data: {
                senderId: sender,
                receiverId: receiver,
                content: message,
                conversationId: conversation.id
            }
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
