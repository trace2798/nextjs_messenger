import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

// The `getCurrentUser` function returns the current user, or `null` if the user is not logged in.
const getCurrentUser = async () => {
  try {
    // Get the session.
    const session = await getSession();

    // If the session does not have a user, return `null`.
    if (!session?.user?.email) {
      return null;
    }
    // Find the user with the specified email address.
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    // If the user is not found, return `null`.
    if (!currentUser) {
      return null;
    }
    // Return the user.
    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
