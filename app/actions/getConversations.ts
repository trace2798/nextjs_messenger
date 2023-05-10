import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

// The `getConversations` function returns all conversations for the current user.
const getConversations = async () => {
  const currentUser = await getCurrentUser();
  // If the current user does not have an ID, return an empty array.
  if (!currentUser?.id) {
    return [];
  }

  try {
    // Find all conversations where the current user is a participant.
    // Order the results by the last message's timestamp, descending.
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    // Return the conversations.
    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
