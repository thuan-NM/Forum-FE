import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckFollowStatus, FollowUser, UnfollowUser } from "../../services";
import toast from "react-hot-toast";

interface FollowStatus {
  isFollowing: boolean;
}

export const useFollowUser = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: isFollowing,
    isLoading: isCheckingFollow,
    refetch,
  } = useQuery<FollowStatus, Error, boolean, [string, string]>({
    queryKey: ["users-follows", userId],
    queryFn: () =>
      CheckFollowStatus(userId, "users").then((data) => ({
        isFollowing: data.isFollowing,
      })),
    select: (res) => res.isFollowing,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      isFollowing ? UnfollowUser(userId, "users") : FollowUser(userId, "users"),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["users-follows", userId],
      });
      await queryClient.cancelQueries({ queryKey: ["user", userId] });

      const previousFollowStatus = queryClient.getQueryData([
        "users-follows",
        userId,
      ]);
      const previousUserData = queryClient.getQueryData(["user", userId]);

      // Update follow status optimistically
      queryClient.setQueryData(["users-follows", userId], !isFollowing);

      if (previousUserData) {
        queryClient.setQueryData(["user", userId], (old: any) => {
          const currentCount = old?.user?.followersCount ?? 0;
          return {
            ...old,
            user: {
              ...old.user,
              followersCount: isFollowing ? currentCount - 1 : currentCount + 1,
            },
          };
        });
      }

      return { previousFollowStatus, previousUserData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFollowStatus !== undefined) {
        queryClient.setQueryData(
          ["users-follows", userId],
          context.previousFollowStatus
        );
      }
      if (context?.previousUserData) {
        queryClient.setQueryData(["user", userId], context.previousUserData);
      }
      toast.error("Follow/Unfollow thất bại");
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-follows"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  return {
    isFollowing,
    isCheckingFollow,
    toggleFollow: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
};
