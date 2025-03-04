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


// Delete a conversation
export const deleteConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Check if the conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) },
      include: { messages: true },  // Include messages to delete them later
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete associated messages first
    await prisma.message.deleteMany({
      where: { conversationId: parseInt(conversationId) },
    });

    // Then delete the conversation itself
    await prisma.conversation.delete({
      where: { id: parseInt(conversationId) },
    });

    return res.status(200).json({ message: 'Conversation and all messages deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong while deleting the conversation' });
  }
};
