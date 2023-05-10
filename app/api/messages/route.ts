import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

// Defines the POST method that handles the HTTP POST request.
export async function POST(request: Request) {
  try {
    // Gets the current user from the app.
    const currentUser = await getCurrentUser();
    // Parses the request body as JSON.
    const body = await request.json();
    // Destructures the message, image, and conversationId from the request body.
    const { message, image, conversationId } = body;
    // Returns an error response if the user is not authorized.
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Creates a new message in the database.
    const newMessage = await prisma?.message.create({
      //includes the seen and sender fields, which are related tables, by using the include keyword.
      include: {
        seen: true,
        sender: true,
      },
      //specifies the values for the new message's fields, including body, image, conversation, sender, and seen.
      //conversation is connected to the conversation with the given conversationId, sender is connected to the user with the current user's id, and seen is connected to the current user's id as well.
      data: {
        body: message,
        image: image,
        //conversation: an object with a connect property that connects the message to the conversation with the given conversationId.
        conversation: {
          connect: { id: conversationId },
        },
        //sender: an object with a connect property that connects the message to the user with the current user's id.
        sender: {
          connect: { id: currentUser.id },
        },
        //seen: an object with a connect property that connects the message to the current user's id.
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // Updates the conversation in the database with the new message.
    const updatedConversation = await prisma.conversation.update({
      //where: the filter condition for finding the conversation to update, which in this case is the id passed as an argument to the function.
      where: {
        id: conversationId,
      },
      //data: an object that updates the conversation's lastMessageAt field to the current date and time and connects the new message to the conversation via the messages field.
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      //include: an object that specifies which related fields to include in the returned result. In this case, it includes the users field and the messages field, which in turn includes the seen field.
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    // Logs the error to the console and returns an error response.
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("Error", { status: 500 });
  }
}
