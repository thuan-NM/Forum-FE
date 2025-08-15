import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateUser } from "../../services/UserServices";

export const useUpdateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      UpdateUser(id, data),
    onSuccess: (id) => {
      if (onSuccessCallback) onSuccessCallback();
      toast.success(`Chỉnh sửa thông tin người dùng thành công`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.refetchQueries({ queryKey: ["user", id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Đã xảy ra lỗi khi cập nhật thông tin người dùng");
    },
  });

  const handleUpdate = async (id: string, data: any) => {
    return await updateMutation.mutateAsync({ id, data });
  };

  return {
    UpdateUser: handleUpdate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
