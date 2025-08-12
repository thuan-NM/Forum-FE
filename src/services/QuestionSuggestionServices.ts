import axios from "../utils/configAxios.ts";

const SendMessage = async (text: string) => {
  return (await axios.post(`/suggestions/chat`, { text: text })).data;
};

export { SendMessage };
