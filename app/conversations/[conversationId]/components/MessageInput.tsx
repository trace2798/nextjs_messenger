"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

// Defines the props for the MessageInput component.
interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

// Defines the MessageInput component.
const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
}) => {
  // Renders an input element with the specified props.
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black dark:text-neutral-300 font-light py-2 px-4 bg-neutral-100 dark:bg-slate-600 w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
