import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCommentStatus } from "../../services/CommentServices";
import toast from "react-hot-toast";
import capitalize from "../../utils/capitalize";

export const useUpdateCommentStatus = () => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            UpdateCommentStatus(id, status),
        onSuccess: (data) => {
            toast.success(`${capitalize(data.comment.status)} bình luận thành công`);
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Cập nhật trạng thái bình luận thất bại");
        },
    });

    const handleUpdateStatus = (id: string, status: string) => {
        updateMutation.mutate({ id, status });
    };

    return {
        UpdateCommentStatus: handleUpdateStatus,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
    };
};