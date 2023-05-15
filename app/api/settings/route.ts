/**
 * This code defines two API endpoints: POST and DELETE.
 *
 * POST Endpoint:
 * - Updates the current user's name and image in the database.
 * - Requires authentication.
 * - Expects a JSON body with 'name' and 'image' properties.
 * - Returns the updated user object as a JSON response.
 *
 * DELETE Endpoint:
 * - Deletes the current user's account and associated conversations from the database.
 * - Requires authentication.
 * - Returns the deleted account details as a JSON response.
 */

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

/**
 * POST endpoint for updating the current user's name and image.
 *
 * @param request - The incoming HTTP request object.
 * @returns A response object containing the updated user object as JSON.
 */
// Define an asynchronous function called POST that takes a request object as its parameter
export async function POST(request: Request) {
  try {
    // Retrieve the current user using the getCurrentUser function
    const currentUser = await getCurrentUser();
    // Parse the JSON data from the request body and extract the 'name' and 'image' properties
    const body = await request.json();
    const { name, image } = body;
    // If there is no current user ID, return a 401 Unauthorized response using the NextResponse object
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Use the Prisma client to update the user's name and image
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image: image,
        name: name,
      },
    });
    // Return the updated user object as a JSON response using the NextResponse object
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.log(error, "ERROR_SETTINGS");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * DELETE endpoint for deleting the current user's account and associated conversations.
 *
 * @param request - The incoming HTTP request object.
 * @returns A response object containing the deleted account details as JSON.
 */
export async function DELETE(request: Request) {
  try {
    // Get the current user's information
    const currentUser = await getCurrentUser();

    // If no current user is found, return null
    if (!currentUser?.id) {
      return NextResponse.json(null);
    }
    // Delete the user's account and associated conversations using Prisma's transaction
    const deletedAccount = await prisma.$transaction([
      prisma.user.deleteMany({
        where: {
          id: currentUser.id,
        },
      }),
      prisma.conversation.deleteMany({
        where: {
          userIds: {
            has: currentUser.id,
          },
        },
      }),
    ]);
    // Return the deleted account details as a JSON response using the NextResponse object
    return NextResponse.json(deletedAccount);
  } catch (error) {
    // If an error occurs, return null
    return NextResponse.json(null);
  }
}
