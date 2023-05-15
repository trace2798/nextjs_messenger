/**
 * This code handles the POST request for marking a message as seen in a conversation.
 * It updates the 'seen' status of the last message in the conversation for the current user.
 *
 * @param request - The incoming HTTP request object.
 * @param params - The parameters object containing the conversationId.
 * @returns A response object indicating the success or failure of the operation.
 */
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    // Retrieve the current user using the getCurrentUser function
    const currentUser = await getCurrentUser();
    const { conversationId } = params;
    // Check if the current user is authorized
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the existing conversation based on the conversationId
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });
    // If no conversation is found, return an error response
    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // Find the last message in the conversation
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    // If there is no last message, return the conversation object
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update the 'seen' status of the last message for the current user
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // Update all connections with the new seen status
    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // If the current user has already seen the message, no further action is needed
    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updatedMessage
    );

    return new NextResponse("Success");
  } catch (error) {
    console.log(error, "ERROR_MESSAGES_SEEN");
    return new NextResponse("Error", { status: 500 });
  }
}
