// The code you have provided is a function that gets the current user's session information. The function imports the getServerSession function from the next-auth library and the authOptions object from the @/app/api/auth/[...nextauth]/route file.
//The function then calls the getServerSession function with the authOptions object as an argument. The getServerSession function returns the current user's session information, which is then returned by the function.
// Import the `getServerSession` function from NextAuth.js.
import { getServerSession } from "next-auth";
// Import the `authOptions` object from the `[...nextauth]` route.
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Export a function that gets the current user's session information.
export default async function getSession() {
  // Call the `getServerSession` function with the `authOptions` object as an argument.
  return await getServerSession(authOptions);
}
