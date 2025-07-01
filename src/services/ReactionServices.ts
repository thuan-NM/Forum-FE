
import { ReactionCreateDto, ReactionResponse } from "../store/interfaces/reactionInterfaces.ts";
import axios from "../utils/configAxios.ts";

interface ReactionQuery {
  reaction_id?: string;
  limit?: number;
  page?: number;
}

const ListReactions = async (filters: any) => {
  const response = await axios.get("/reactions/", { params: filters });
  return response.data;
};

const ListReactionsByReactable = async (
  query: ReactionQuery
): Promise<{ reactions: ReactionResponse[]; total: number }> => {
  try {
    const response = await axios.get(`/reactions/${query.reaction_id}`, {
      withCredentials: true,
    });
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
  return response.data;
};

const UpdateReaction = async (id: string, data: Partial<ReactionCreateDto>) => {
  const response = await axios.put(`/reactions/${id}`, data);
  return response.data;
};

const DeleteReaction = async (id: string) => {
  const response = await axios.delete(`/reactions/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const CreateReaction = async (data: ReactionCreateDto) => {
  const response = await axios.post(`/reactions/`, data, {
    withCredentials: true,
  });
  return response.data;
};

export {
  CreateReaction,
  ListReactions,
  ListReactionsByReactable,
  getAllReactions,
  UpdateReaction,
  DeleteReaction,
};
