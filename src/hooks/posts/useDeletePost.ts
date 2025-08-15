import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeletePost } from "../../services/PostServices";
import toast from "react-hot-toast";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeletePost,
    onSuccess: () => {
      toast.success("Xóa bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Xóa bài viết thất bại");
    },
  });

  const handleDeletePost = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    DeletePost: handleDeletePost,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
