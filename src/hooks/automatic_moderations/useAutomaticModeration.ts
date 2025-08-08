import { useMutation } from "@tanstack/react-query";
import { AutomaticModeration } from "../../services/AutomaticModerationServices";

export const useAutomaticModeration = () => {
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const result = await AutomaticModeration(text);
      return result; 
    },
  });

  return {
    automaticModeration: mutation.mutateAsync,
    isModerating: mutation.isPending,
    moderatedLabel: mutation.data,
    moderateError: mutation.error,
  };
};
