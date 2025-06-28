import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloseQuestion } from "../../services/QuestionServices";
import toast from "react-hot-toast";

export const useCloseQuestion = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => CloseQuestion(id),
    onSuccess: () => {
      toast.success(`Close question successfully`);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update question status"
      );
    },
  });

  const handleUpdate = (id: string) => {
    updateMutation.mutate({ id });
  };

  return {
    CloseQuestion: handleUpdate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
