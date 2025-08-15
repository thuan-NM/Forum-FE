import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { ResetPassword } from "../../services/AuthServices";
import toast from "react-hot-toast";
import { Button, Form, Input } from "@heroui/react";
import AuthLayout from "../../layouts/AuthLayout";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      ResetPassword(data),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay."
      );
      navigate("/auth");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Đặt lại mật khẩu thất bại.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token không hợp lệ.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    mutate({ token, newPassword });
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-row p-0 h-4/5 mb-5">
          <div className="container mx-auto w-3/4 px-6 border-x !border-content4">
            <p className="border-b mb-3 border-content4 pb-2 text-sm font-semibold">
              Lỗi
            </p>
            <div className="space-y-6 text-xs text-center">
              <p className="text-gray-700 mb-4">
                Token không hợp lệ. Vui lòng thử lại.
              </p>
              <Link
                to="/auth/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Gửi lại yêu cầu
              </Link>
            </div>
          </div>
        </div>
        <hr className="!text-white border-content4" />
        <Footer position="center" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-row p-0 h-3/5 mb-5">
        <div className="container mx-auto w-3/4 px-6 border-x !border-content4">
          <p className="border-b mb-3 border-content4 pb-2 text-sm font-semibold">
            Đặt lại mật khẩu
          </p>
          <Form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <Input
              label={
                <span className="text-xs font-bold mb-0">Mật khẩu mới</span>
              }
              autoComplete=""
              isRequired
              labelPlacement="outside"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              type="password"
              variant="bordered"
              value={newPassword}
              onChange={handleChange}
              radius="none"
              className="bg-content1"
              minLength={6}
            />
            <Input
              label={
                <span className="text-xs font-bold mb-0">
                  Xác nhận mật khẩu
                </span>
              }
              autoComplete=""
              isRequired
              labelPlacement="outside"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              type="password"
              variant="bordered"
              value={confirmPassword}
              onChange={handleChange}
              radius="none"
              className="bg-content1"
              minLength={6}
            />
            {error && (
              <p className="text-red-600 text-center text-xs">
                {(error as any).message}
              </p>
            )}
            <div className="flex justify-between mt-4 items-center w-full">
              <Link
                to="/auth"
                className="block text-xs text-content5 hover:underline"
              >
                Quay lại đăng nhập
              </Link>
              <Button
                type="submit"
                color="primary"
                size="sm"
                className="text-sm font-semibold"
                radius="full"
                isLoading={isPending}
              >
                {isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <hr className="!text-white border-content4" />
      <Footer position="center" />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
