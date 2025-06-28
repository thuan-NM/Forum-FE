import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Register } from "../../services/AuthServices";

export const useCreateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: Register,
    onSuccess: () => {
      toast.success("User created successfully");
      if (onSuccessCallback) onSuccessCallback();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to create user");
    },
  });

  const handleCreateUser = (data: any) => {
    createMutation.mutate(data);
  };

  return {
    CreateUser: handleCreateUser,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
