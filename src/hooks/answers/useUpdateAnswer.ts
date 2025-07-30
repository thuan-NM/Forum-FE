import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateAnswer } from "../../services"; // đường dẫn có thể cần sửa lại theo dự án bạn
import type { AnswerCreateDto } from "../../store/interfaces/answerInterfaces";

export const useUpdateAnswer = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AnswerCreateDto }) =>
      UpdateAnswer(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật câu trả lời thành công");
      queryClient.invalidateQueries({ queryKey: ["answers"] });
      queryClient.invalidateQueries({
        queryKey: ["answers", variables.id],
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Cập nhật câu trả lời thất bại"
      );
    },
  });

  return {
    updateAnswer: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
