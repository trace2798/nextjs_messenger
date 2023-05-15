import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { ThemeToggle } from "../components/theme/theme-toggle";
import Head from "next/head";

export default function Home() {
  return (
    <>
      
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 dark:">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <Image
            height="48"
            width="48"
            className="mx-auto w-auto"
            src="/images/logo.png"
            alt="Logo"
          /> */}
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-t from-gray-900 to-gray-500">
              Sign in to your account
            </span>
          </h2>
        </div>
        <div className="flex justify-center mt-2">
          <ThemeToggle />
        </div>
        <AuthForm />
      </div>
    </>
  );
}
