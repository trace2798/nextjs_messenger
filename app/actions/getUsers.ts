import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

// The `getUsers` function returns all users, except the current user.
const getUsers = async () => {
  // Get the session.
  const session = await getSession();
  // If the session does not have a user, return an empty array.
  if (!session?.user?.email) {
    return [];
  }

  try {
    // Find all users, except the current user.
    // Order the results by the creation date, descending.
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
    // Return the users.
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
