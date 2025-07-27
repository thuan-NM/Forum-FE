import axios from "../utils/configAxios.ts";

const Upload = async (data: any) => {
  return (await axios.post("/attachments/upload", data)).data;
};

const UpdateTag = async (id: string, data: any) => {
  return (await axios.put(`/tags/${id}`, data)).data;
};

export { UpdateTag, Upload };
