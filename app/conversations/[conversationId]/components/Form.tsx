"use client";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

interface FormProps {}

const Form: FC<FormProps> = ({}) => {
  // Fetches the current conversation ID using a custom hook.
  const { conversationId } = useConversation();
  // Initializes the form object using react-hook-form.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  // Handles form submit event.
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Resets the message field value.
    setValue("message", "", { shouldValidate: true });
    // Sends a POST request to the server with the form data.
    //We are spreading the data which will only hold the message for now. We need to add conversationId to keep track of the conversation where the messages are.
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  //Handles file upload with cloudinary
  const handleUpload = (result: any) => {
    // Sends a POST request to the server with the uploaded image and conversation ID.
    axios.post("/api/messages", {
      image: result.info.secure_url,
      conversationId: conversationId,
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      {/* Cloudinary upload button for uploading images. */}
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="m0jnay7c"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      {/* Message form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          //due to being required, if we try send blank nothing will happen
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
