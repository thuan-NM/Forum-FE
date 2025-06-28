import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePostStatus } from "../../services/PostServices";
import toast from "react-hot-toast";
import capitalize from "../../utils/capitalize";

export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      UpdatePostStatus(id, status),
    onSuccess: (data) => {
      toast.success(`${capitalize(data.post.status)} post successfully`);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update post status"
      );
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  return {
    UpdatePostStatus: handleUpdateStatus,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
