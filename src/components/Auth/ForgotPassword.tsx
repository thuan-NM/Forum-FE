import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "@heroui/react";
import { ForgotPassword } from "../../services/AuthServices";
import AuthLayout from "../../layouts/AuthLayout";
import Footer from "../Common/Footer";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: ForgotPassword,
    onSuccess: (data) => {
      setMessage(
        data.message ||
          "Email đặt lại mật khẩu đã được gửi thành công. Vui lòng kiểm tra hộp thư."
      );
    },
    onError: (err: any) => {
      setMessage(err.response?.data?.error || "Gửi yêu cầu thất bại.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    mutate(email);
  };

  return (
    <AuthLayout>
      <div className="flex flex-row p-0 !h-3/5 mb-5">
        <div className="container mx-auto w-3/4 px-6 border-x !border-content4 h-full">
          <p className="border-b mb-3 border-content4 pb-2 text-sm font-semibold">
            Quên mật khẩu
          </p>
          <Form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <Input
              label={<span className="text-xs font-bold mb-0">Email</span>}
              autoComplete=""
              isRequired
              labelPlacement="outside"
              name="email"
              placeholder="Địa chỉ email"
              type="email"
              variant="bordered"
              value={email}
              onChange={handleChange}
              radius="none"
              className="bg-content1"
            />
            {message && (
              <p
                className={`text-center text-xs ${
                  message.includes("thành công")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
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
                {isPending ? "Đang gửi..." : "Gửi yêu cầu đặt lại"}
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

export default ForgotPasswordPage;
