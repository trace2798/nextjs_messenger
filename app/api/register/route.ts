/**
 * This code handles the POST request for creating a new user in the system.
 * It securely hashes the password using bcrypt and stores the user details in the database.
 *
 * @param request - The incoming HTTP request object.
 * @returns A response object containing the newly created user as JSON.
 */
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  //extract the email, name, and password fields.
  const { email, name, password } = body;
  // Hash the password using bcrypt with a cost factor of 12
  const hashedPassword = await bcrypt.hash(password, 12);
  // Create a new user in the database using the hashed password
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
  // Return the newly created user as a JSON response
  return NextResponse.json(user);
}
