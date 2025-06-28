import { useEffect, useState } from "react";
import { useLoginMutation } from "../../hooks/users/useLoginMutation";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";

type CredentialsType = {
    email: string;
    password: string;
};

const Login = () => {
    const { registeredEmail } = useAuth();

    const [credentials, setCredentials] = useState<CredentialsType>({
        email: registeredEmail || "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const { mutate, isPending } = useLoginMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(credentials);
    };

    useEffect(() => {
        setCredentials((prev) => ({ ...prev, email: registeredEmail || "" }));
    }, [registeredEmail]);

    return (
        <div className="container mx-auto w-1/2 px-6 border-l !border-content4">
            <p className="border-b mb-3 border-content4 pb-2 text-sm font-semibold">
                Đăng nhập
            </p>
            <Form onSubmit={(e) => handleSubmit(e)} className="space-y-6 text-xs">
                <Input
                    label={<span className="text-xs font-bold mb-0">Email</span>}
                    autoComplete=""
                    isRequired
                    labelPlacement="outside"
                    name="email"
                    placeholder="Your email address"
                    type="email"
                    variant="bordered"
                    value={credentials.email}
                    onChange={handleChange}
                    radius="none"
                    className="bg-content1"
                />
                <Input
                    label={<span className="text-xs font-bold mb-0">Password</span>}
                    isRequired
                    autoComplete=""
                    labelPlacement="outside"
                    name="password"
                    placeholder="Your password"
                    type="password"
                    variant="bordered"
                    value={credentials.password}
                    onChange={handleChange}
                    radius="none"
                    className="bg-content1"
                />

                <div className="flex justify-between mt-4 items-center w-full">
                    <Link
                        to="/forgotpassword"
                        className="block text-xs text-content5 hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                    <Button
                        type="submit"
                        color="primary"
                        className="text-sm font-semibold"
                        radius="full"
                        isLoading={isPending}
                    >
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Login;