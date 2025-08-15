import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CreateReaction,
  DeleteReaction,
  GetReactionStatus,
} from "../../services/ReactionServices";
import {
  ReactionCreateDto,
  ReactionResponse,
} from "../../store/interfaces/reactionInterfaces";

interface ReactionStatus {
  hasReacted: boolean;
  reaction?: ReactionResponse;
  reactionsCount: number;
}

interface MutationContext<T = unknown> {
  previousReactionStatus: ReactionStatus | undefined;
  previousList: T[] | undefined;
}

/**
 * useReactItem hook dùng để kiểm tra và quản lý trạng thái reaction cho posts, comments, hoặc answers
 * @param id: ID của item (post_id, comment_id, hoặc answer_id)
 * @param type: "posts" | "comments" | "answers"
 */
export const useReactItem = <T extends { id: string; reactionsCount?: number }>(
  id: string,
  type: string
) => {
  const queryClient = useQueryClient();

  // Fetch reaction status
  const {
    data: reactionStatus,
    isLoading: isCheckingReaction,
    refetch,
  } = useQuery<ReactionStatus, Error, ReactionStatus, [string, string]>({
    queryKey: [`${type}-reactions`, id],
    queryFn: async () => {
      const query: {
        post_id?: string;
        comment_id?: string;
        answer_id?: string;
      } = {};
      if (type === "posts") query.post_id = id;
      else if (type === "comments") query.comment_id = id;
      else if (type === "answers") query.answer_id = id;

      if (!id) throw new Error("ID is required");

      const response = await GetReactionStatus(query);
      return {
        hasReacted: response.has_reacted,
        reaction: response.reaction,
        reactionsCount: response.count,
      };
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  // Create reaction mutation
  const createReactionMutation = useMutation<
    { message: string; reaction: ReactionResponse },
    Error,
    { id: string; type: string },
    MutationContext<T>
  >({
    mutationFn: ({ id, type }) => {
      if (!id) throw new Error("ID là bắt buộc");
      const data: ReactionCreateDto = {};
      if (type === "posts") data.post_id = parseInt(id);
      else if (type === "comments") data.comment_id = parseInt(id);
      else if (type === "answers") data.answer_id = parseInt(id);
      return CreateReaction(data);
    },
    onError: (error) => {
      toast.error(error.message || "Thao tác tương tác thất bại");
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  // Delete reaction mutation
  const deleteReactionMutation = useMutation<
    { message: string },
    Error,
    { id: string; type: string; reactionId?: string },
    MutationContext<T>
  >({
    mutationFn: ({ reactionId }) => {
      if (!reactionId) throw new Error("Reaction ID is required");
      return DeleteReaction(reactionId);
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi xóa tương tác");
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const handleToggleReaction = () => {
    if (!reactionStatus) return;
    if (reactionStatus.hasReacted && reactionStatus.reaction?.id) {
      deleteReactionMutation.mutate({
        id,
        type,
        reactionId: reactionStatus.reaction.id.toString(),
      });
    } else {
      createReactionMutation.mutate({ id, type });
    }
  };

  return {
    hasReacted: reactionStatus?.hasReacted ?? false,
    reaction: reactionStatus?.reaction,
    reactionsCount: reactionStatus?.reactionsCount ?? 0,
    isCheckingReaction,
    handleToggleReaction,
    isPending:
      createReactionMutation.isPending || deleteReactionMutation.isPending,
  };
};
