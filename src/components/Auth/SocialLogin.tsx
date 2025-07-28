import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginSuccess } from "../../store/slices/authSlice";
import { setUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/hooks";
import toast from "react-hot-toast";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import RegisterComponent from "./Register";

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
        toast.success("Đăng nhập thành công");
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast.error(error.response?.data?.error || "Đăng nhập thất bại");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập bằng Google thất bại");
  };

  return (
    <div className="flex flex-col space-y-2 w-1/2 px-6 mt-2">
      <p className="text-xs mb-4 text-content5">
        Khi tiếp tục, bạn đồng ý với{" "}
        <span className="text-blue-500">Điều khoản dịch vụ</span> và{" "}
        <span className="text-blue-500">Chính sách quyền riêng tư</span> của KatzBlog.
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
      <RegisterComponent/>
    </div>
  );
};

export default SocialLogin;
