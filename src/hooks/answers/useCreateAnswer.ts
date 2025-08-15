import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateAnswer } from "../../services/AnswerServices";
import type { AnswerCreateDto } from "../../store/interfaces/answerInterfaces";

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, AnswerCreateDto>({
    mutationFn: CreateAnswer,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Trả lời câu hỏi thất bại");
    },
    onSuccess: (_data, variables) => {
      toast.success("Trả lời câu hỏi thành công");

      // invalidate chính xác danh sách câu trả lời cho question
      queryClient.invalidateQueries({
        queryKey: ["answers", variables.questionId],
      });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const createAnswer = (
    data: AnswerCreateDto,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    mutation.mutate(data, options);
  };

  return {
    createAnswer,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
