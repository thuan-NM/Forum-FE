import axios from "axios";
const apiUrl = import.meta.env.VITE_PREDICT_API;
const AutomaticModeration = async (data: string) => {
  const response = await axios.post(`${apiUrl}/automatic-moderation`, {
    text: data,
  });
  return response.data;
};
export { AutomaticModeration };
