import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreatePost } from "../../services";
import { PostCreateDto } from "../../store/interfaces/postInterfaces";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: CreatePost,
    onSuccess: (data: any) => {
      toast.success(data.message || "Tạo bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["posts", "list"], // Thêm "list" để tránh conflict với TagPostList
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Đăng bài thất bại");
    },
  });

  const handleCreatePost = (data: PostCreateDto) => {
    createMutation.mutate(data);
  };

  return {
    createPost: handleCreatePost,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
