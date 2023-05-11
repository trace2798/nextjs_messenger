import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // Extract the conversation ID from the request parameters
    const { conversationId } = params;
    // Get the current user's information
    const currentUser = await getCurrentUser();

    // If no current user is found, return null
    if (!currentUser?.id) {
      return NextResponse.json(null);
    }
    // Retrieve the conversation with the given ID from the database
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    // If no conversation is found, return a 400 error response
    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }
    // Delete the conversation with the given ID from the database
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });
    
    // Notify each user in the conversation that the conversation has been deleted
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    });
    // Return a JSON response containing the deleted conversation information
    return NextResponse.json(deletedConversation);
  } catch (error) {
    // If an error occurs, return null
    return NextResponse.json(null);
  }
}
