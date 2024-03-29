import AuthForm from "./components/AuthForm";
import { ThemeToggle } from "../components/theme/theme-toggle";

export default function Home() {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 dark:">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-500">
            Sign in to your account
          </h2>
          <p className="text-center text-slate-600 uppercase text-xs">
            Confidential. Secure. Classified
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <ThemeToggle />
        </div>
        <AuthForm />
      </div>
    </>
  );
}
