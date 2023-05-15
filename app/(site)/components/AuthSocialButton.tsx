import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ 
  icon: Icon,
  onClick,
}) => {
  return ( 
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        w-full 
        justify-center 
        rounded-md 
        bg-white
        dark:bg-slate-800 
        hover:bg-black
        dark:hover:bg-neutral-200
        px-4 
        py-2 
        text-gray-500 
        hover:text-white
        dark:text-neutral-300
        dark:hover:text-slate-700
        shadow-sm 
        ring-1 
        ring-inset 
        ring-gray-300 
        dark:ring-indigo-600
        focus:outline-offset-0
      "
    >
      <Icon />
    </button>
   );
}
 
export default AuthSocialButton;