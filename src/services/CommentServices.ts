// import type { AnswerResponse } from "../store/interfaces/answerInterfaces.ts";
import type { CommentResponse } from "../store/interfaces/commentInterfaces.ts";
import axios from "../utils/configAxios.ts"

// const GetAnswer = async (id: string): Promise<AnswerResponse> => {
//     if (!id) throw new Error("Answer ID is required");
//     const response = await axios.get(`/answers/${id}`, { withCredentials: true });
//     if (!response.data?.answer) throw new Error("Answer not found");
//     return response.data.answer;
// };

// const DeleteAnswer = async (id: string) => {
//     return (await axios.delete(`/answers/${id}`, { withCredentials: true })).data
// }
interface ReplyQuery {
    comment_id: string;
    limit?: number;
    page?: number;
}

const ListComments = async (filters: any) => {
    const response = await axios.get('/comments/', { params: filters });
    return response.data;
};
const ListReplies = async (query: ReplyQuery): Promise<{ replies: CommentResponse[]; total: number }> => {
    try {
        const response = await axios.get(`/comments/${query.comment_id}/replies`, {
            withCredentials: true,
        });
        return {
            replies: response.data.replies || [],
            total: response.data.total || 0,
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch replies');
    }
};
const getAllComments = async (filter: any) => {
    const response = await axios.get("/comments/all", { params: filter, withCredentials: true, })
    return response.data
}

const UpdateCommentStatus = async (id: string, status: string) => {
    const response = await axios.put(`/comments/status/${id}`, { status: status })
    return response.data
}

const DeleteComment = async (id: string) => {
    const response = await axios.delete(`/comments/${id}`, { withCredentials: true })
    return response.data
}
export { ListComments, ListReplies, getAllComments, UpdateCommentStatus, DeleteComment }