import axios from "../utils/configAxios.ts";

const GetTopicById = async (id: string) => {
  return (await axios.get(`/topics/${id}`)).data.data;
};

const GetAllTopics = async (filter: any) => {
  const response = await axios.get("/topics/", {
    params: filter,
    withCredentials: true,
  });
  return response.data;
};

const DeleteTopic = async (id: string) => {
  return (await axios.delete(`/topics/${id}`)).data;
};

const CreateTopic = async (data: any) => {
  return (await axios.post("/topics/", data)).data;
};

const UpdateTopic = async (id: string, data: any) => {
  return (await axios.put(`/topics/${id}`, data)).data;
};

export { GetTopicById, GetAllTopics, DeleteTopic, UpdateTopic, CreateTopic };
