import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckFollowStatus, FollowTopic, UnfollowTopic } from "../../services";
import toast from "react-hot-toast";

interface FollowStatus {
  isFollowing: boolean;
}

export const useFollowTopic = (topicId: string) => {
  const queryClient = useQueryClient();

  const {
    data: isFollowing,
    isLoading: isCheckingFollow,
    refetch,
  } = useQuery<FollowStatus, Error, boolean, [string, string]>({
    queryKey: ["topics-follows", topicId],
    queryFn: () =>
      CheckFollowStatus(topicId, "topics").then((data) => ({
        isFollowing: data.isFollowing,
      })),
    select: (res) => res.isFollowing,
    enabled: !!topicId,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      isFollowing
        ? UnfollowTopic(topicId, "topics")
        : FollowTopic(topicId, "topics"),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["topics-follows", topicId],
      });
      await queryClient.cancelQueries({ queryKey: ["topic", topicId] });

      const previousFollowStatus = queryClient.getQueryData([
        "topics-follows",
        topicId,
      ]);
      const previousTopicData = queryClient.getQueryData(["topic", topicId]);

      // Update follow status optimistically
      queryClient.setQueryData(["topics-follows", topicId], !isFollowing);

      // Update topic followers count optimistically
      if (previousTopicData) {
        queryClient.setQueryData(["topic", topicId], (old: any) => {
          const currentCount = old?.topic?.followersCount ?? 0;
          return {
            ...old,
            topic: {
              ...old.topic,
              followersCount: isFollowing ? currentCount - 1 : currentCount + 1,
            },
          };
        });
      }

      return { previousFollowStatus, previousTopicData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFollowStatus !== undefined) {
        queryClient.setQueryData(
          ["topics-follows", topicId],
          context.previousFollowStatus
        );
      }
      if (context?.previousTopicData) {
        queryClient.setQueryData(["topic", topicId], context.previousTopicData);
      }
      toast.error("Follow/Unfollow thất bại");
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["topics-follows"] });
      queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
    },
  });

  return {
    isFollowing,
    isCheckingFollow,
    toggleFollow: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
};
