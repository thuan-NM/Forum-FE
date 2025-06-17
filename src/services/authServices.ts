import axios from "../utils/configAxios";

const Register = async (data: object) => {
  return (await axios.post("/register", data)).data;
};

const Login = async (data: object) => {
  const response = await axios.post("/login", data);
  return response.data;
};

const LogoutAccount = async () => {
  const response = await axios.post("/logout");
  return response.data;
};

const VerifyEmail = async (token?: string) => {
  const response = await axios.get(`/verify-email?token=${token}`);
  console.log(response.data);
  return response.data;
};

const ResendEmail = async (email: string) => {
  const response = await axios.post(`/resend-verification`, { email: email });
  return response.data;
};

const GetUserFromToken = async (token: string) => {
  const response = await axios.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { Register, Login, LogoutAccount, VerifyEmail, ResendEmail, GetUserFromToken };