import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateReport } from "../../services/ReportServices";
import toast from "react-hot-toast";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({
      reason,
      contentType,
      contentId,
      contentPreview,
      details,
    }: {
      reason: string;
      contentType: string;
      contentId: string;
      contentPreview: string;
      details?: string;
    }) => CreateReport(reason, contentType, contentId, contentPreview, details),
    onSuccess: () => {
      toast.success("Đã báo cáo cho quản trị viên");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Đã xảy ra lỗi khi báo cáo");
    },
  });

  const handleCreateReport = (
    reason: string,
    contentType: string,
    contentId: string,
    contentPreview: string,
    details?: string
  ) => {
    createMutation.mutate({
      reason,
      contentType,
      contentId,
      contentPreview,
      details,
    });
  };

  return {
    CreateReportHook: handleCreateReport,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
