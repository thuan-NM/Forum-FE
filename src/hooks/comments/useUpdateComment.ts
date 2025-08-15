import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateComment } from "../../services/CommentServices";
import { CommentResponse } from "../../store/interfaces/commentInterfaces";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CommentResponse }) =>
      UpdateComment(id, data.content),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật bình luận thành công");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      variables.data.answerId &&
        queryClient.refetchQueries({
          queryKey: ["comments", variables.data.answerId],
        });
      variables.data.postId &&
        queryClient.refetchQueries({
          queryKey: ["comments", variables.data.postId],
        });
      variables.data.parentId &&
        queryClient.refetchQueries({
          queryKey: ["comments", variables.data.parentId],
        });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Cập nhật bình luận thất bại");
    },
  });

  const handleUpdateComment = (id: string, data: CommentResponse) => {
    updateMutation.mutate({ id, data });
  };

  return {
    updateComment: handleUpdateComment,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
