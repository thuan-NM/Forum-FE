import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloseQuestion } from "../../services/QuestionServices";
import toast from "react-hot-toast";

export const useCloseQuestion = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => CloseQuestion(id),
    onSuccess: () => {
      toast.success(`Đóng câu hỏi thành công`);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Cập nhật trạng thái câu hỏi thất bại"
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
