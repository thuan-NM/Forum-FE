import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateAnswerStatus } from "../../services/AnswerServices";
import toast from "react-hot-toast";
import capitalize from "../../utils/capitalize";

export const useUpdateAnswerStatus = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      UpdateAnswerStatus(id, status),
    onSuccess: (data) => {
      toast.success(`${capitalize(data.answer.status)} answer successfully`);
      queryClient.invalidateQueries({ queryKey: ["answers"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update answer status"
      );
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  return {
    updateAnswerStatus: handleUpdateStatus,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
