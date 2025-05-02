import axios from "../utils/configAxios"

const PassQuestion = async (id: number) => {
    return (await axios.put(`/passes/${id}/pass`)).data
}
const GetPassedQuestionIDs = async () => {
    return (await axios.delete(`/passes/passed-ids`)).data
}


export { PassQuestion, GetPassedQuestionIDs }