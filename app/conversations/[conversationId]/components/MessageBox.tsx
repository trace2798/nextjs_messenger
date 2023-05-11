"use client";
import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useState } from "react";
import ImageModal from "./ImageModal";

// Define the props expected by the MessageBox component
interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: FC<MessageBoxProps> = ({ data, isLast }) => {
  // Get the user session information
  const session = useSession();
  // Set up state to control whether or not the image modal is open
  const [imageModalOpen, setImageModalOpen] = useState(false);
  // Determine whether the message was sent by the current user
  const isOwn = session.data?.user?.email === data?.sender?.email;
  // Build a string listing the users who have seen the message, excluding the sender
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");
  // Build className strings based on message ownership and other properties
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  return (
    <div className={container}>
      {/* Display the avatar for the message sender */}
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      {/* Display th message contents */}
      <div className={body}>
        {/* Display the message sender's name and the time the message was sent */}
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        {/* Display the message body or image */}
        <div className={message}>
          <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
          {/* Display the message image, if there is one */}
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            /* Display the message body, if there is one */
            <div>{data.body}</div>
          )}
        </div>
        {/* Display the list of users who have seen the message, if this is the last message in the conversation and the message was sent by the current user. */}
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500 ">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
