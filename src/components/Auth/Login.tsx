// components/auth/Login.tsx

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/slices/authSlice"; // Đảm bảo import từ 'authSlice'
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);
    const user = useAppSelector((state: RootState) => state.user.user);
    console.log(user); // Kiểm tra thông tin người dùng trong console

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Dispatch login action
        const resultAction = await dispatch(loginUser(credentials));

        if (loginUser.fulfilled.match(resultAction)) {
            toast.success("Đăng nhập thành công.");
            navigate("/");
        } else if (loginUser.rejected.match(resultAction)) {
            toast.error(resultAction.payload as string);
        }
    };

    return (
        <div className="container mx-auto w-1/2 px-6 border-l border-neutral-700 ">
            <p className="border-b mb-4 border-neutral-700 pb-2 text-sm font-semibold text-white">
                Đăng nhập
            </p>
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        className="w-full p-[10px] border border-neutral-600 rounded-sm mt-2 "
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="font-bold">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full p-[10px] border !bg-black border-neutral-600 rounded-sm mt-2"
                        required
                    />
                </div>

                <div className="flex justify-between mt-4 items-center">
                    <Link
                        to={"/forgotpassword"}
                        className="block text-xs text-neutral-400 hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default Login;
