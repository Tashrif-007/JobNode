import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getConversations = async (req, res) => {
  try {
    const userId = parseInt(req.params.id); 

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1: userId }, { user2: userId }],
      },
      select: { user1: true, user2: true }, 
    });

    const userIds = [
      ...new Set(
        conversations.flatMap(({ user1, user2 }) =>
          user1 === userId ? user2 : user1
        )
      ),
    ];

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createConversation = async (req,res) => {
  try {
    const {senderId, receiverId} = req.body;
    const conversation  =await prisma.conversation.create({
      data: {
        user1: senderId,
        user2: receiverId,
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}