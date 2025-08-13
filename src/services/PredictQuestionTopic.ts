import axios from "axios";
const apiUrl = import.meta.env.VITE_PREDICT_API;
const PredictQuestionTopic = async (data: string) => {
  // const response = await axios.post(
  //   `${apiUrl}/predict-fasttext`,
  //   { text: data },
  // );
  const response = await axios.post(
    `${apiUrl}/predict-fasttext-top-k`,
    { text: data },
  );
  return response.data;
};
export { PredictQuestionTopic };
