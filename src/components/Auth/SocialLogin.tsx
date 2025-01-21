import React from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

const SocialLogin: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google"; // URL đăng nhập Google
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8080/auth/facebook"; // URL đăng nhập Facebook
  };

  return (
    <div className="flex flex-col space-y-2 w-1/2 px-6 mt-2">
      <p className="text-xs mb-4">By continuing you indicate that you agree to Quora’s <span className="text-blue-500">Terms of Service</span> and <span className="text-blue-500">Privacy Policy</span>.</p>
      <button className="bg-[#121212] !text-white flex justify-start !h-10 items-center px-4">
        <FaGoogle className="w-5 h-5" />
        <span className="ml-3 text-sm">Sign in with Google</span>
      </button>
      <button className="bg-[#121212] !text-white flex justify-start !h-10 items-center px-4">
        <FaFacebook className="w-5 h-5" />
        <span className="ml-3 text-sm">Sign in with Google</span>
      </button>
      <p className="text-center text-sm text-gray-500 mt-4">
        <Link to={"/register"} className="text-xs  font-semibold text-white">
          Sign up with email
        </Link>
      </p>
    </div>
  );
};

export default SocialLogin;
