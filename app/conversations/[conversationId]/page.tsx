// The code you have provided is a function that renders a chat interface for a given conversation ID.
import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import { FC } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

// Define an interface for the function's parameters.
interface IParams {
  conversationId: string;
}
// The `ChatId` component renders a chat view for a given conversation.
const ChatId = async ({ params }: { params: IParams }) => {
  // Get the conversation and messages for the given conversation ID.
  const conversation = await getConversationById(params.conversationId);
  // Get the messages in the conversation.
  const messages = await getMessages(params.conversationId);
  // If the conversation is not found, render an empty state.
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  return (
    <>
      {/*  // Render a chat interface with the conversation and its messages. */}
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <Header conversation={conversation} />
          <Body />
          <Form />
        </div>
      </div>
    </>
  );
};

export default ChatId;
