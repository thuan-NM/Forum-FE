import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { CommentResponse } from "../../store/interfaces/commentInterfaces";
import { DeleteComment } from "../../services/CommentServices";

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteComment,
        onSuccess: () => {
            toast.success("Comment deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to comment answer");
        },
    });

    const handleDeleteComment = (comment: CommentResponse) => {
        deleteMutation.mutate(comment.id.toString());
    };

    return {
        deleteComment: handleDeleteComment,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
    };
};