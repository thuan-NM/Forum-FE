import type { ReportResponse } from "../store/interfaces/reportInterfaces.ts";
import axios from "../utils/configAxios.ts";

const GetReport = async (id: string): Promise<ReportResponse> => {
  if (!id) throw new Error("Report ID is required");
  const response = await axios.get(`/reports/${id}`, { withCredentials: true });
  if (!response.data?.report) throw new Error("Report not found");
  return response.data.report;
};

const DeleteReport = async (id: string) => {
  return (await axios.delete(`/reports/${id}`, { withCredentials: true })).data;
};

const ListReports = async (
  filters: {
    search?: string;
    status?: string;
    content_type?: string;
    reporter_id?: number;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: string;
  } = {}
): Promise<{ reports: ReportResponse[]; total: number }> => {
  try {
    const response = await axios.get(`/reports`, {
      params: {
        search: filters.search,
        status: filters.status,
        content_type: filters.content_type,
        reporter_id: filters.reporter_id,
        page: filters.page || 1,
        limit: filters.limit || 10,
        sort_by: filters.sort_by,
        order: filters.order,
      },
      withCredentials: true,
    });
    return {
      reports: response.data.reports || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    throw new Error("Failed to fetch reports");
  }
};

const GetAllReports = async (filters: any) => {
  const response = await axios.get("/reports/", { params: filters });
  return response.data;
};

const UpdateReportStatus = async (
  id: string,
  status: string,
  resolvedBy?: number
) => {
  if (!id) throw new Error("Report ID is required");
  if (!status) throw new Error("Status is required");
  const response = await axios.put(
    `/reports/${id}/status`,
    { status, resolved_by: resolvedBy },
    { withCredentials: true }
  );
  return response.data;
};

const CreateReport = async (
  reason: string,
  contentType: string,
  contentId: string,
  contentPreview: string,
  details?: string
): Promise<ReportResponse> => {
  if (!reason) throw new Error("Reason is required");
  if (!contentType) throw new Error("Content type is required");
  if (!contentId) throw new Error("Content ID is required");
  if (!contentPreview) throw new Error("Content preview is required");
  const response = await axios.post(
    `/reports/`,
    {
      reason: reason,
      content_type: contentType,
      content_id: contentId,
      content_preview: contentPreview,
      details: details,
    },
    { withCredentials: true }
  );
  if (!response.data?.report) throw new Error("Failed to create report");
  return response.data.report;
};

const BatchDeleteReports = async (ids: string[]) => {
  if (!ids || ids.length === 0) throw new Error("Report IDs are required");
  const response = await axios.post(
    `/reports/batch-delete`,
    { ids },
    { withCredentials: true }
  );
  return response.data;
};

export {
  GetReport,
  DeleteReport,
  ListReports,
  GetAllReports,
  UpdateReportStatus,
  CreateReport,
  BatchDeleteReports,
};
