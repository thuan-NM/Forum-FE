// hooks/questions/useUpdateQuestion.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateQuestion } from "../../services";
import type {  QuestionUpdateDto } from "../../store/interfaces/questionInterfaces";

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: QuestionUpdateDto;
    }) => {
      const res = await UpdateQuestion(id, data);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật câu hỏi thành công", {
        style: {
          fontSize: "12px",
          lineHeight: "1.25rem",
          fontWeight: "500",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Cập nhật câu hỏi thất bại");
    },
  });

  return {
    updateQuestion: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
