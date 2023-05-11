import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

//exports an asynchronous function that accepts a NextApiRequest object and a NextApiResponse object as arguments
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  //retrieves the user session from the server using getServerSession, passing in the request, response, and authentication options as arguments.
  const session = await getServerSession(request, response, authOptions);
  //checks if the user is authenticated by verifying if the user session exists and contains an email.
  // If the user is not authenticated, the function returns a 401 status code (Unauthorized).
  if (!session?.user?.email) {
    return response.status(401);
  }
  // retrieves the socket_id property from the request body, which identifies the specific Pusher socket connection.
  const socketId = request.body.socket_id;
  // retrieves the channel_name property from the request body, which identifies the Pusher channel to be authorized.
  const channel = request.body.channel_name;
  // constructs an object with the user_id property set to the user's email address retrieved from the session object.
  const data = {
    user_id: session.user.email,
  };
  //calls the authorizeChannel method of the pusherServer object to generate an authorization response for the specified socket connection and channel using the provided data.
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  // sends the authorization response back to the client.
  return response.send(authResponse);
}
