import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DeleteQuestion } from "../../services/QuestionServices";

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete question");
    },
  });

  const handleDeleteQuestion = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    DeleteQuestion: handleDeleteQuestion,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
