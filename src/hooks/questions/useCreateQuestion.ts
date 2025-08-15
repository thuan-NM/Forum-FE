// hooks/questions/useCreateQuestion.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateQuestion } from "../../services";
import type { QuestionCreateDto } from "../../store/interfaces/questionInterfaces";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: QuestionCreateDto) => {
      const res = await CreateQuestion(data);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Đặt câu hỏi thành công", {
        style: {
          fontSize: "12px",
          lineHeight: "1.25rem",
          fontWeight: "500",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Đặt câu hỏi thất bại");
    },
  });

  return {
    createQuestion: mutation.mutate,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
};
