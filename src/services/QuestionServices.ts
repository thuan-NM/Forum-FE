import type { QuestionCreateDto } from "../store/interfaces/questionInterfaces.ts";
import axios from "../utils/configAxios.ts";

const CreateQuestion = async (data: QuestionCreateDto) => {
  return (await axios.post("/questions/", data)).data;
};

const ListQuestion = async (filter: any) => {
  const response = await axios.get("/questions/", { params: filter });
  return response.data;
};
const GetAllQuestions = async (filter: any) => {
  const response = await axios.get("/questions/all", { params: filter });
  return response.data;
};
const DeleteQuestion = async (id: string) => {
  return (await axios.delete(`/questions/${id}`)).data;
};
const GetQuestionById = async (id: string) => {
  return (await axios.get(`/questions/${id}`)).data.question;
};

const UpdateQuestion = async (id: string, data: any) => {
  return (await axios.put(`/questions/${id}`, data)).data;
};

const UpdateQuestionStatus = async (id: string, status: string) => {
  const response = await axios.put(`/questions/${id}/status`, { status });
  return response.data;
};

const CloseQuestion = async (id: string) => {
  const response = await axios.put(`/questions/${id}/interaction-status`, {
    interaction_status: "closed",
  });
  return response.data;
};

export {
  CreateQuestion,
  GetQuestionById,
  DeleteQuestion,
  ListQuestion,
  UpdateQuestion,
  UpdateQuestionStatus,
  CloseQuestion,
  GetAllQuestions,
};
