import axios from "../utils/configAxios.ts"

const PassQuestion = async (id: string) => {
    return (await axios.put(`/passes/${id}/pass`)).data
}
const GetPassedQuestionIDs = async () => {
    return (await axios.delete(`/passes/passed-ids`)).data
}


export { PassQuestion, GetPassedQuestionIDs }