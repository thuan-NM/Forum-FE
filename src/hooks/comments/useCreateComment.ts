import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { CommentCreateDto } from "../../store/interfaces/commentInterfaces";
import { CreateComment } from "../../services/CommentServices";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: CreateComment,
    onSuccess: () => {
      toast.success("Comment created successfully");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to comment answer");
    },
  });

  const handleCreateComment = (comment: CommentCreateDto) => {
    createMutation.mutate(comment);
  };

  return {
    createComment: handleCreateComment,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
