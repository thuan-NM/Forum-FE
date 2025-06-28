import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateUserStatus } from "../../services/UserServices";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      UpdateUserStatus(id, status),
    onSuccess: (data) => {
      const status = data.data.status == "banned" ? "Banned" : "Unbanned";
      toast.success(`${status} user successfully`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update user status"
      );
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  return {
    UpdateUserStatus: handleUpdateStatus,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
