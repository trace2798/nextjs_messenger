"use client";
//renders a group of user avatars. The component takes in an array of User objects as a prop, and by default, it renders the first three users in the array (or fewer if there are fewer than three users).
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
  users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  // take only the first 3 users
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]", // position the first user on the top left
    1: "bottom-0", // position the second user at the bottom
    2: "bottom-0 right-0", // position the third user on the bottom right
  };

  return (
    <div className="relative h-11 w-11">
      {/* map over the slicedUsers array and render the avatars */}
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `}
        >
          {/* use the user image or the default group image if user image is not available */}
          <Image
            fill
            src={user?.image || "/images/placeholder.png"}
            alt="Avatar"
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
