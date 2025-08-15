import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAnswer } from "../../services/AnswerServices";
import toast from "react-hot-toast";
import type { AnswerResponse } from "../../store/interfaces/answerInterfaces";

export const useDeleteAnswer = () => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteAnswer,
        onSuccess: () => {
            toast.success("Xóa câu trả lời thành công");
            queryClient.invalidateQueries({ queryKey: ["answers"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Xóa câu trả lời thất bại");
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