import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get users the logged-in user has had conversations with
export const getConversations = async (req, res) => {
  try {
    const userId = parseInt(req.params.id); // Get logged-in user ID from params

    // Find all conversations where the user is involved
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1: userId }, { user2: userId }],
      },
      select: { user1: true, user2: true }, // Fetch only user1 and user2
    });

    // Extract unique user IDs (excluding the logged-in user)
    const userIds = [
      ...new Set(
        conversations.flatMap(({ user1, user2 }) =>
          user1 === userId ? user2 : user1
        )
      ),
    ];

    // Fetch users from the User table based on extracted user IDs
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
