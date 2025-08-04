import type {
  CommentCreateDto,
  CommentResponse,
} from "../store/interfaces/commentInterfaces.ts";
import axios from "../utils/configAxios.ts";

interface ReplyQuery {
  comment_id: string;
  limit?: number;
  page?: number;
}

const ListComments = async (filters: any) => {
  const response = await axios.get("/comments/", { params: filters });
  return response.data;
};
const ListReplies = async (
  query: ReplyQuery
): Promise<{ replies: CommentResponse[]; total: number }> => {
  try {
    const response = await axios.get(`/comments/${query.comment_id}/replies`, {
      withCredentials: true,
    });
    return {
      replies: response.data.replies || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch replies"
    );
  }
};
const getAllComments = async (filter: any) => {
  const response = await axios.get("/comments/all", {
    params: filter,
    withCredentials: true,
  });
  return response.data;
};

const UpdateCommentStatus = async (id: string, status: string) => {
  const response = await axios.put(`/comments/status/${id}`, {
    status: status,
  });
  return response.data;
};

const DeleteComment = async (id: string) => {
  const response = await axios.delete(`/comments/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
const CreateComment = async (data: CommentCreateDto) => {
  const response = await axios.post(`/comments/`, data, {
    withCredentials: true,
  });
  return response.data;
};

const UpdateComment = async (id: string, data: string) => {
  const response = await axios.put(
    `/comments/${id}`,
    { content: data },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
export {
  CreateComment,
  ListComments,
  ListReplies,
  getAllComments,
  UpdateCommentStatus,
  DeleteComment,
  UpdateComment,
};
