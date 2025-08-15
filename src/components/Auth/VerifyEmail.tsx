import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { VerifyEmail } from "../../services/AuthServices";
import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Footer from "../Common/Footer";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data, error, isLoading } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: () => VerifyEmail(token || ""),
    enabled: !!token && !localStorage.getItem(`verified_${token}`),
    retry: false,
  });

  // Lưu trạng thái đã xác minh vào localStorage sau khi thành công
  React.useEffect(() => {
    if (
      data?.message === "Xác thực email thành công, bạn có thể đăng nhập ngay."
    ) {
      localStorage.setItem(`verified_${token}`, "true");
    }
  }, [data, token]);

  return (
    <AuthLayout>
      <div className="flex flex-row p-0 h-3/5 mb-5">
        <div className="container mx-auto w-3/4 px-6 !border-content4">
          <p className="border-b mb-16 border-content4 pb-2 text-sm font-semibold">
            Xác minh email
          </p>
          <div className="space-y-6 text-xs text-center">
            {isLoading ? (
              <p className="text-lg text-gray-700">Đang xác minh email...</p>
            ) : error ? (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  Xác minh email thất bại
                </h2>
                <p className="text-gray-700 mb-4">
                  {error.message || "Đã xảy ra lỗi không xác định"}
                </p>
                <Link
                  to="/auth/resend-verification"
                  className="block text-xs text-content5 hover:underline"
                >
                  Gửi lại email xác minh
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Xác minh email thành công
                </h2>
                <p className="text-gray-700 mb-4">
                  {data?.message ||
                    "Email đã được xác minh. Bạn có thể đăng nhập."}
                </p>
                <Link
                  to="/auth"
                  className="block text-xs text-content5 hover:underline"
                >
                  Đến trang đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <hr className="!text-white border-content4" />
      <Footer position="center" />
    </AuthLayout>
  );
};

export default VerifyEmailPage;
