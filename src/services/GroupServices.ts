import { GroupFormData } from '../store/interfaces/groupInterfaces'
import axios from '../utils/configAxios.ts'

const CreateGroup = async (formdata:GroupFormData) =>{
    return (await axios.post('/groups/',formdata,{ withCredentials: true })).data
}
const GetAllGroup = async () =>{
    return (await axios.get('/groups/',{ withCredentials: true })).data.groups || []
}

export {CreateGroup,GetAllGroup}