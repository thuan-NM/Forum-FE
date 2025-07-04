import axios from "../utils/configAxios.ts";

interface ReactionCreateDto {
  post_id?: number;
  comment_id?: number;
  answer_id?: number;
}

interface ReactionResponse {
  id: number;
  user_id: number;
  post_id?: number;
  comment_id?: number;
  answer_id?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    // Các trường khác của user
  };
  post?: {
    id: number;
    // Các trường khác của post
  };
  comment?: {
    id: number;
    // Các trường khác của comment
  };
  answer?: {
    id: number;
    // Các trường khác của answer
  };
}

interface CheckReactionQuery {
  post_id?: string;
  comment_id?: string;
  answer_id?: string;
}

interface ReactionStatusResponse {
  has_reacted: boolean;
  reaction?: ReactionResponse;
  count: number;
}

const ListReactions = async (filters: any) => {
  const response = await axios.get("/reactions/", { params: filters });
  if (!response.data || typeof response.data !== "object") {
    throw new Error("Invalid response data");
  }
  return response.data;
};

const ListReactionsByReactable = async (query: {
  reaction_id?: string;
  limit?: number;
  page?: number;
}): Promise<{ reactions: ReactionResponse[]; total: number }> => {
  try {
    const response = await axios.get(`/reactions/${query.reaction_id}`, {
      withCredentials: true,
    });
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response data");
    }
    return {
      reactions: response.data.reactions || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch reactions"
    );
  }
};

const getAllReactions = async (filter: any) => {
  const response = await axios.get("/reactions/all", {
    params: filter,
    withCredentials: true,
  });
  if (!response.data || typeof response.data !== "object") {
    throw new Error("Invalid response data");
  }
  return response.data;
};

const UpdateReaction = async (id: string, data: Partial<ReactionCreateDto>) => {
  const response = await axios.put(`/reactions/${id}`, data);
  if (!response.data || typeof response.data !== "object") {
    throw new Error("Invalid response data");
  }
  return response.data;
};

const DeleteReaction = async (id: string) => {
  const response = await axios.delete(`/reactions/${id}`, {
    withCredentials: true,
  });
  if (!response.data || typeof response.data !== "object") {
    throw new Error("Invalid response data");
  }
  return response.data;
};

const CreateReaction = async (data: ReactionCreateDto) => {
  const response = await axios.post(`/reactions/`, data, {
    withCredentials: true,
  });
  if (!response.data || typeof response.data !== "object") {
    throw new Error("Invalid response data");
  }
  return response.data;
};

const CheckUserReaction = async (
  query: CheckReactionQuery
): Promise<{
  has_reacted: boolean;
  reaction?: ReactionResponse;
  count: number;
}> => {
  try {
    const response = await axios.get("/reactions/check", {
      params: query,
      withCredentials: true,
    });
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response data");
    }
    return {
      has_reacted: response.data.has_reacted || false,
      reaction: response.data.reaction,
      count: Number(response.data.count) || 0,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to check user reaction"
    );
  }
};

const GetReactionCount = async (
  query: CheckReactionQuery
): Promise<{ count: number }> => {
  try {
    const response = await axios.get("/reactions/count", {
      params: query,
      withCredentials: true,
    });
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response data");
    }
    return {
      count: Number(response.data.count) || 0,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch reaction count"
    );
  }
};

const GetReactionStatus = async (
  query: CheckReactionQuery
): Promise<ReactionStatusResponse> => {
  try {
    const response = await axios.get("/reactions/status", {
      params: query,
      withCredentials: true,
    });
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response data");
    }
    return {
      has_reacted: response.data.has_reacted || false,
      reaction: response.data.reaction,
      count: Number(response.data.count) || 0,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch reaction status"
    );
  }
};

export {
  CreateReaction,
  ListReactions,
  ListReactionsByReactable,
  getAllReactions,
  UpdateReaction,
  DeleteReaction,
  CheckUserReaction,
  GetReactionCount,
  GetReactionStatus,
};
