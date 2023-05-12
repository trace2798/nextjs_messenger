"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/input/Input";
import Select from "@/app/components/input/Select";
import Modal from "@/app/components/modals/Modal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

// Defining interface
interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

// Defining GroupChatModal component
const GroupChatModal: FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter();
  // Using React's useState hook to manage loading state
  const [isLoading, setIsLoading] = useState(false);
  // Using react-hook-form's useForm hook to manage form state
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });
  // Watching for changes in members field
  const members = watch("members");
  // Defining form submit function
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //sets the isLoading state to true
    setIsLoading(true);
    //makes a POST request to the /api/conversations endpoint with the form data and isGroup set to true.
    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      //if successful calls router.refresh() to reload the current page and then calls onClose() to close the modal.
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      // Finally, it sets the isLoading state to false.
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
              text-base 
              font-semibold 
              leading-7 
              text-gray-900
              dark:text-neutral-100
            "
            >
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-300">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
