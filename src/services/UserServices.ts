import axios from "../utils/configAxios.ts";

const GetUserById = async (id: string) => {
  return (await axios.get(`/users/${id}`)).data.data;
};

const GetAllUsers = async (filter: any) => {
  const response = await axios.get("/users/", {
    params: filter,
    withCredentials: true,
  });
  return response.data;
};

const UpdateUserStatus = async (id: string, status: string) => {
  return (await axios.put(`/users/${id}/status`, { status })).data;
};

const DeleteUser = async (id: string) => {
  return (await axios.delete(`/users/${id}`)).data;
};

const UpdateUser = async (id: string, data: any) => {
  console.log(data);
  return (await axios.put(`/users/${id}`, data)).data;
};

export { GetUserById, GetAllUsers, UpdateUserStatus, DeleteUser, UpdateUser };
