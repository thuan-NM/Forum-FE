import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdatePost } from "../../services";
import { PostCreateDto } from "../../store/interfaces/postInterfaces";

export const useUpdatePost = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostCreateDto }) =>
      UpdatePost(id, data),
    onSuccess: (data: any) => {
      toast.success(data.message || "Cập nhật bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Cập nhật bài viết thất bại");
    },
  });

  return {
    updatePost: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
