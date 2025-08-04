import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AcceptAnswer } from "../../services";

export const useAcceptAnswer = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: (id: string) => AcceptAnswer(id),
    onSuccess: (_data, id) => {
      toast.success("Chọn câu trả lời hữu ích cho câu hỏi thành công");

      queryClient.invalidateQueries({ queryKey: ["answers"] });
      queryClient.invalidateQueries({ queryKey: ["answer", id] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Chọn câu trả lời thất bại"
      );
    },
  });

  return {
    acceptAnswer: acceptMutation.mutate,
    isAccepting: acceptMutation.isPending,
    acceptError: acceptMutation.error,
  };
};
