import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";

const useActiveChannel = () => {
  // Retrieve the set, add, and remove functions from the useActiveList hook.
  const { set, add, remove } = useActiveList();
  // using useState to keep track of the active channel and the state of the channel.
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  // useEffect hook, which triggers when the component is mounted and dismounted.
  useEffect(() => {
    let channel = activeChannel;

    //initializes a new Pusher channel called "presence-messenger" and subscribes to it via the pusherClient.subscribe method if the channel variable is not already set
    // important to use the word "presence-"
    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }
    //If the pusher:subscription_succeeded event is triggered, retrieve the initial list of members and call the set function to update the members state with the list of member IDs
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      //iterate through the members and push their email. We have to use .each since it is a special class from pusher.
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
    });
    // If the pusher:member_added event is triggered, add the new member ID to the members state using the add function.
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });
    // If the pusher:member_removed event is triggered, remove the member ID from the members state using the remove function.
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });
    //Return a cleanup function that unsubscribes from the channel instance and sets activeChannel to null.
    //Declare dependencies for the useEffect hook.
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
