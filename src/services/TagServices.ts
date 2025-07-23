import axios from "../utils/configAxios.ts";

const GetTagById = async (id: string) => {
  return (await axios.get(`/tags/${id}`)).data;
};

const GetAllTags = async (filter: any) => {
  const response = await axios.get("/tags/", {
    params: filter,
    withCredentials: true,
  });
  return response.data;
};

const DeleteTag = async (id: string) => {
  return (await axios.delete(`/tags/${id}`)).data;
};

const CreateTag = async (data: any) => {
  return (await axios.post("/tags/", data)).data;
};

const UpdateTag = async (id: string, data: any) => {
  return (await axios.put(`/tags/${id}`, data)).data;
};

export { GetTagById, GetAllTags, DeleteTag, UpdateTag, CreateTag };
