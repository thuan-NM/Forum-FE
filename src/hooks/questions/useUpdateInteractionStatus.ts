import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateInteractionStatus } from "../../services";

export const useUpdateInteractionStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      interaction_status,
    }: {
      id: string;
      interaction_status: string;
    }) => {
      const res = await UpdateInteractionStatus(id, interaction_status);
      return res;
    },
    onSuccess: (data) => {
      toast.success("Cập nhật trạng thái câu hỏi thành công");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Cập nhật trạng thái câu hỏi thất bại"
      );
    },
  });

  return {
    updateInteractionStatus: mutation.mutate,
    isUpdatingInteractionStatus: mutation.isPending,
    updateInteractionError: mutation.error,
  };
};
