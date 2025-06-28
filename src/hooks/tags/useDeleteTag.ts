import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DeleteTag } from "../../services/TagServices";

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteTag,
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete tag");
    },
  });

  const handleDeleteTag = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    DeleteTag: handleDeleteTag,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
