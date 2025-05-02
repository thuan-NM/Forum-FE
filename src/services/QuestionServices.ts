import axios from "../utils/configAxios";

const CreateQuestion = async (data: object) => {
    return (await axios.post("/questions/", data)).data;
};

const GetQuestion = async () => {
    return (await axios.get("/questions/")).data.questions || [];
};

const DeleteQuestion = async (id: number) => {
    return (await axios.delete(`/questions/${id}`)).data;

}

export { CreateQuestion, GetQuestion, DeleteQuestion };