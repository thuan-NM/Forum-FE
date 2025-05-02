import axios from "../utils/configAxios";

const Register = async (data: object) => {
  return (await axios.post("/register", data)).data;
};

const Login = async (data: object) => {
  return (await axios.post("/login", data)).data;
};

export { Register, Login };