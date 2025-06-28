import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateTag } from "../../services/TagServices";

export const useUpdateTag = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      UpdateTag(id, data),
    onSuccess: () => {
      if (onSuccessCallback) onSuccessCallback();
      toast.success(`Edit tag successfully`);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update tag");
    },
  });

  const handleUpdate = (id: string, data: any) => {
    updateMutation.mutate({ id, data });
  };

  return {
    UpdateTag: handleUpdate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
