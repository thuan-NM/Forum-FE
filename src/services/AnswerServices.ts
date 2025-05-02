import { AnswerFormData } from "../store/interfaces/answerInterfaces"
import axios from "../utils/configAxios"

const CreateAnswer = async (data: AnswerFormData) => {
    return (await axios.post('/answers/', data, { withCredentials: true })).data
}

const GetAnswer = async (id:number) =>{
    return (await axios.get(`/answers/${id}`,{ withCredentials: true })).data.posts || []
}

const DeleteAnswer = async (id: number) => {
    return (await axios.delete(`/answers/${id}`, { withCredentials: true })).data
}
const EditAnswer = async (data: AnswerFormData, id: number) => {
    return (await axios.put(`/answers/${id}`, data, { withCredentials: true })).data
}

const ListAnswers = async () => {
    return (await axios.get(`/answers/`, { withCredentials: true })).data
}
export {CreateAnswer,GetAnswer,DeleteAnswer,EditAnswer,ListAnswers}