import axios from "../utils/configAxios.ts";

interface FileResponse {
  message: string;
  file: {
    id: number;
    url: string;
    thumbnail_url?: string;
    file_name: string;
    file_type: string;
    file_size: number;
  };
}

export const uploadFile = async (
  file: File,
  entityType: string,
  entityId: number
): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("entity_type", entityType);
  formData.append("entity_id", entityId.toString());

  const response = await axios.post<FileResponse>("/files/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
