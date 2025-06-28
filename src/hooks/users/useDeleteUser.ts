import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DeleteUser } from "../../services/UserServices";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete user");
    },
  });

  const handleDeleteUser = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    DeleteUser: handleDeleteUser,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
