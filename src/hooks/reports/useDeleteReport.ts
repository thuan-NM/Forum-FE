import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteReport } from "../../services/ReportServices";
import toast from "react-hot-toast";

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteReport,
    onSuccess: () => {
      toast.success("Report deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete report");
    },
  });

  const handleDeleteReport = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    DeleteReportHook: handleDeleteReport,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
