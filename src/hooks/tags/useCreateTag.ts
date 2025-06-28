import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateTag } from "../../services/TagServices";

export const useCreateTag = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: CreateTag,
    onSuccess: () => {
      toast.success("Tag created successfully");
      if (onSuccessCallback) onSuccessCallback();
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to create tag");
    },
  });

  const handleCreateTag = (data: any) => {
    createMutation.mutate(data);
  };

  return {
    CreateTag: handleCreateTag,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
