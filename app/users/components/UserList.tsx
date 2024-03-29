"use client";

import { User } from "@prisma/client";

import UserBox from "./UserBox";
import Avatar from "@/app/components/Avatar";
import { useState } from "react";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  // const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      /> */}
      <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 dark:border-indigo-300 block w-full left-0 dark:bg-slate-800">
        <div className="px-5">
          <div className="flex justify-between">
            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-300 py-4">
              People
            </div>
            {/* <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer hover:opacity-75 transition mt-5 lg:invisible"
            >
              <Avatar user={currentUser} />
            </div> */}
          </div>
          {items.map((item) => (
            <UserBox key={item.id} data={item} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default UserList;
