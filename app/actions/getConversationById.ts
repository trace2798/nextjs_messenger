import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

// The `getConversationById` function takes a conversation ID as an argument and returns the corresponding conversation.
const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    // If the current user does not have an email, return null
    if (!currentUser?.email) {
      return null;
    }
    // Find the conversation with the given ID in the prisma database and include the users associated with it
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    // Return the conversation object
    return conversation;
  } catch (error: any) {
    console.log(error, "SERVER_ERROR");
    return null;
  }
};

export default getConversationById;
