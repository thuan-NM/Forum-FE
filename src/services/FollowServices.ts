import { TopicResponse } from "../store/interfaces/topicInterfaces.ts";
import { UserResponse } from "../store/interfaces/userInterfaces.ts";
import axios from "../utils/configAxios.ts";

// Interface để định nghĩa kiểu dữ liệu trả về từ API
export interface FollowResponse {
  message?: string;
  follows?: any[];
  topics?: any[];
  [key: string]: any;
}

// Hàm theo dõi (Follow) một entity (topic, question, user)
const followEntity = async (
  id: string,
  type: string
): Promise<FollowResponse> => {
  try {
    const response = await axios.post(
      `/follows/${type}/${id}/follow`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || `Failed to follow ${type}`);
  }
};

// Hàm hủy theo dõi (Unfollow) một entity
const unfollowEntity = async (
  id: string,
  type: string
): Promise<FollowResponse> => {
  try {
    const response = await axios.delete(`/follows/${type}/${id}/unfollow`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || `Failed to unfollow ${type}`
    );
  }
};

// Hàm lấy danh sách người theo dõi hoặc follows của một entity
const getFollows = async (id: string, type: string): Promise<any[]> => {
  try {
    const response = await axios.get(`/follows/${type}/${id}/follows`, {
      withCredentials: true,
    });
    return response.data.follows || [];
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || `Failed to get follows of ${type}`
    );
  }
};

// Hàm lấy danh sách topics mà user đã follow
const getFollowedTopics = async (): Promise<TopicResponse[]> => {
  try {
    const response = await axios.get(`/follows/me/topics`, {
      withCredentials: true,
    });
    return response.data.topics || [];
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to get followed topics"
    );
  }
};
const getFollowedUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await axios.get(`/follows/me/user/followed`, {
      withCredentials: true,
    });
    return response.data.topics || [];
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to get followed topics"
    );
  }
};
const getFollowingUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await axios.get(`/follows/me/user/following`, {
      withCredentials: true,
    });
    return response.data.topics || [];
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to get followed topics"
    );
  }
};
// Hàm kiểm tra trạng thái theo dõi của user đối với một entity
const checkFollowStatus = async (
  id: string,
  type: string
): Promise<FollowResponse> => {
  try {
    const response = await axios.get(`/follows/${type}/${id}/status`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || `Failed to check follow status of ${type}`
    );
  }
};

// Xuất các hàm ra ngoài để sử dụng
export {
  followEntity as FollowQuestion,
  followEntity as FollowTopic,
  followEntity as FollowUser,
  unfollowEntity as UnfollowQuestion,
  unfollowEntity as UnfollowTopic,
  unfollowEntity as UnfollowUser,
  getFollows as GetFollowers,
  getFollowedTopics as GetFollowedTopics,
  checkFollowStatus as CheckFollowStatus,
  getFollowedUsers as GetFollowedUsers,
  getFollowingUsers as GetFollowingUsers,
};
