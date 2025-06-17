import axios from "../utils/configAxios";

const GetUserById = async (id: string) =>{
    return (await axios.get(`/users/${id}`)).data.data
}

export  { GetUserById } ;