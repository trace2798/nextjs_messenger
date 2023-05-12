import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

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

export async function DELETE(request: Request) {
  try {
    // Get the current user's information
    const currentUser = await getCurrentUser();

    // If no current user is found, return null
    if (!currentUser?.id) {
      return NextResponse.json(null);
    }
   
    
    const deletedAccount = await prisma.user.deleteMany({
      where: {
        id: currentUser.id,
      },
    });
    return NextResponse.json(deletedAccount);
  } catch (error) {
    // If an error occurs, return null
    return NextResponse.json(null);
  }
}
