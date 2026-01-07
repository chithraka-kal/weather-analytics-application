import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button 
      className="px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200" 
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;