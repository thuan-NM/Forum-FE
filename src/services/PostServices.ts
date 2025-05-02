import { PostFormData } from "../store/interfaces/postInterfaces"
import axios from "../utils/configAxios"

const CreatePost = async (data: PostFormData) => {
    return (await axios.post('/posts/', data, { withCredentials: true })).data
}

const GetAllPost= async () =>{
    return (await axios.get('/posts/',{ withCredentials: true })).data.posts || []
}

const DeletePost = async (data: number) => {
    return (await axios.delete(`/posts/${data}`, { withCredentials: true })).data
}

export {CreatePost,GetAllPost,DeletePost}