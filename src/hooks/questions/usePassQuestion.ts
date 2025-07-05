import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PassQuestion } from "../../services/PassQuestionServices";
import toast from "react-hot-toast";

export const usePassQuestion = () => {
  const queryClient = useQueryClient();

  const passMutation = useMutation<void, Error, string>({
    mutationFn: PassQuestion,
    onSuccess: () => {
      toast.success("Question passed successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to pass question");
    },
  });

  return {
    passQuestion: passMutation.mutate,
    isPassing: passMutation.isPending,
  };
};
