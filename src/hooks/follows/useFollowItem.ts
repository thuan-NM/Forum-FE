import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CheckFollowStatus,
  FollowQuestion,
  FollowResponse,
  UnfollowQuestion,
} from "../../services/FollowServices";

interface FollowStatus {
  isFollowing: boolean;
}

interface MutationContext<T = unknown> {
  previousFollowStatus: FollowStatus | undefined;
  previousList: T[] | undefined;
}

/**
 * useFollowItem hook dùng cho nhiều type (questions, posts, etc.)
 * @param id: ID của item
 * @param type: "questions" | "posts" | "comments" | ...
 */
export const useFollowItem = <T extends { id: string; followsCount?: number }>(
  id: string,
  type: string
) => {
  const queryClient = useQueryClient();

  const {
    data: isFollowing,
    isLoading: isCheckingFollow,
    refetch,
  } = useQuery<FollowStatus, Error, boolean, [string, string]>({
    queryKey: [type + "-follows", id],
    queryFn: () =>
      CheckFollowStatus(id, type).then((data) => ({
        isFollowing: data.isFollowing,
      })),
    select: (data) => data.isFollowing,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const followMutation = useMutation<
    FollowResponse,
    Error,
    { id: string; type: string },
    MutationContext<T>
  >({
    mutationFn: ({ id, type }) => FollowQuestion(id, type),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [type + "-follows", id] });
      await queryClient.cancelQueries({ queryKey: [type] });

      const previousFollowStatus = queryClient.getQueryData<FollowStatus>([
        type + "-follows",
        id,
      ]);
      const previousList = queryClient.getQueryData<T[]>([type]);

      queryClient.setQueryData([type + "-follows", id], {
        isFollowing: true,
      });

      queryClient.setQueryData<T[]>([type], (old) =>
        Array.isArray(old)
          ? old.map((item) =>
              item.id === id
                ? { ...item, followsCount: (item.followsCount || 0) + 1 }
                : item
            )
          : old || []
      );

      return { previousFollowStatus, previousList };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [type + "-follows", variables.id],
          context.previousFollowStatus
        );
        queryClient.setQueryData([type], context.previousList);
      }
      toast.error(error.message || "Failed to follow item");
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const unfollowMutation = useMutation<
    FollowResponse,
    Error,
    { id: string; type: string },
    MutationContext<T>
  >({
    mutationFn: ({ id, type }) => UnfollowQuestion(id, type),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [type + "-follows", id] });
      await queryClient.cancelQueries({ queryKey: [type] });

      const previousFollowStatus = queryClient.getQueryData<FollowStatus>([
        type + "-follows",
        id,
      ]);
      const previousList = queryClient.getQueryData<T[]>([type]);

      queryClient.setQueryData([type + "-follows", id], {
        isFollowing: false,
      });

      queryClient.setQueryData<T[]>([type], (old) =>
        Array.isArray(old)
          ? old.map((item) =>
              item.id === id
                ? { ...item, followsCount: (item.followsCount || 0) - 1 }
                : item
            )
          : old || []
      );

      return { previousFollowStatus, previousList };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [type + "-follows", variables.id],
          context.previousFollowStatus
        );
        queryClient.setQueryData([type], context.previousList);
      }
      toast.error(error.message || "Failed to unfollow item");
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const handleToggleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ id, type });
    } else {
      followMutation.mutate({ id, type });
    }
  };

  return {
    isFollowing,
    isCheckingFollow,
    handleToggleFollow,
    isPending: followMutation.isPending || unfollowMutation.isPending,
  };
};
