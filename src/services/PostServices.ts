import type {
  PostCreateDto,
  PostResponse,
} from "../store/interfaces/postInterfaces.ts";
import axios from "../utils/configAxios.ts";

const GetPost = async (id: string): Promise<PostResponse> => {
  if (!id) throw new Error("Post ID is required");
  const response = await axios.get(`/posts/${id}`, { withCredentials: true });
  if (!response.data?.post) throw new Error("Post not found");
  return response.data.post;
};

const DeletePost = async (id: string) => {
  return (await axios.delete(`/posts/${id}`, { withCredentials: true })).data;
};
const ListPosts = async (
  questionId: string,
  limit: number = 10,
  page: number = 1
): Promise<{ posts: PostResponse[]; total: number }> => {
  try {
    const response = await axios.get(
      `/posts/questions?question_id=${questionId}`,
      {
        params: { limit, page },
        withCredentials: true,
      }
    );
    return {
      posts: response.data.posts || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    throw new Error("Failed to fetch posts");
  }
};
const GetAllPosts = async (filters: any) => {
  const response = await axios.get("/posts/all", { params: filters });
  return response.data;
};

const UpdatePostStatus = async (id: string, status: string) => {
  const response = await axios.put(`/posts/${id}/status`, { status });
  return response.data;
};

const AcceptPost = async (id: string) => {
  const response = await axios.put(`/posts/${id}/accept`);
  return response.data;
};

const CreatePost = async (post: PostCreateDto) => {
  const response = await axios.post("/posts/", post, { withCredentials: true });
  return response.data;
};

const UpdatePost = async (id: string, post: PostCreateDto) => {
  const response = await axios.put(`/posts/${id}`, post, {
    withCredentials: true,
  });
  return response.data;
};
export {
  GetPost,
  DeletePost,
  ListPosts,
  GetAllPosts,
  UpdatePostStatus,
  AcceptPost,
  CreatePost,
  UpdatePost
};
