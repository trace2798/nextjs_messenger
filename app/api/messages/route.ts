/**
 * This code handles the POST request for creating a new message in a conversation.
 * It saves the message to the database, updates the conversation, and triggers
 * real-time notifications using Pusher.
 *
 * @param request - The incoming HTTP request object.
 * @returns A response object indicating the success or failure of the operation.
 */
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    // Retrieve the current user
    const currentUser = await getCurrentUser();
    // Parse the request body
    const body = await request.json();
    const { message, image, conversationId } = body;
    // Check if the current user is authorized
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Create a new message in the database
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // Update the conversation in the database
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    // Trigger a real-time message notification using Pusher
    await pusherServer.trigger(conversationId, "messages:new", newMessage);
    // Get the last message from the updated conversation
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];
    // Send conversation update notifications to all users in the conversation
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });
    // Return the new message as a JSON response
    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("Error", { status: 500 });
  }
}
