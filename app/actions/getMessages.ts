import prisma from "@/app/libs/prismadb";

// The `getMessages` function takes a conversation ID as an argument and returns an array of messages in that conversation.
const getMessages = async (conversationId: string) => {
  try {
    // Find all messages in the specified conversation.
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      //we use ascending since the newest message will be shown in the bottom-most conversation.
      orderBy: {
        createdAt: "asc",
      },
    });
    // Return the messages.
    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
