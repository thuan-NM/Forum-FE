import React from "react";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import { loginSuccess } from "../../store/slices/authSlice";
import { setUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/hooks";
import toast from "react-hot-toast";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const SocialLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const dispatch = useAppDispatch();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential; // Lấy ID token từ Google
      const response = await axios.post(
        "http://localhost:8080/api/google-login",
        { idToken }
      );
      const { token, user } = response.data;

      if (token && user) {
        // Lưu token và user vào Redux
        dispatch(loginSuccess({ token }));
        dispatch(setUser(user));
        setToken(token); // Cập nhật AuthContext
        toast.success("Login successful");
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };

  const handleFacebookLogin = () => {
    // Tạm giữ nguyên cho Facebook, hoặc áp dụng cách tương tự sau
    window.location.href = "http://localhost:8080/auth/facebook";
  };

  return (
    <div className="flex flex-col space-y-2 w-1/2 px-6 mt-2">
      <p className="text-xs mb-4 text-content5">
        By continuing you indicate that you agree to Quora’s{" "}
        <span className="text-blue-500">Terms of Service</span> and{" "}
        <span className="text-blue-500">Privacy Policy</span>.
      </p>
      <div className="w-full flex flex-col gap-y-3">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          shape="pill"
          width="auto"
          auto_select={true}
        />
      </div>
    </div>
  );
};

export default SocialLogin;
