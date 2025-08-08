import { useMutation } from "@tanstack/react-query";
import { PredictQuestionTopic } from "../../services/PredictQuestionTopic";

export const usePredictTopic = () => {
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const result = await PredictQuestionTopic(text);
      return result; // { id, name, ... }
    },
  });

  return {
    predictTopic: mutation.mutateAsync, // mutateAsync để dùng await
    isPredicting: mutation.isPending,
    predictedTopic: mutation.data,
    predictError: mutation.error,
  };
};
