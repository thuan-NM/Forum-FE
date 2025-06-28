import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAnswer } from "../../services/AnswerServices";
import toast from "react-hot-toast";
import type { AnswerResponse } from "../../store/interfaces/answerInterfaces";

export const useDeleteAnswer = () => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteAnswer,
        onSuccess: () => {
            toast.success("Answer deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["answers"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to delete answer");
        },
    });

    const handleDeleteAnswer = (answer: AnswerResponse) => {
        deleteMutation.mutate(answer.id.toString());
    };

    return {
        deleteAnswer: handleDeleteAnswer,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
    };
};