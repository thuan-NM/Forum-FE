import axios from "../utils/configAxios"

const FollowQuestion = async (id: number) => {
    return (await axios.put(`/follows/${id}/follow`)).data
}
const UnfollowQuestion = async (id: number) => {
    return (await axios.delete(`/follows/${id}/unfollow`)).data
}
const GetFollowers = async () => {
    return (await axios.get('/follows/:id/followers/', { withCredentials: true })).data.posts || []
}

const CheckFollowStatus = async (id: number) => {
    return (await axios.get(`/follows/${id}/follow-status`)).data
}


export { FollowQuestion, UnfollowQuestion, GetFollowers,CheckFollowStatus }