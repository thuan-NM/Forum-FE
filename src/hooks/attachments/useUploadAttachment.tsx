import { useMutation } from "@tanstack/react-query";
import { Upload } from "../../services/UploadServices";

/**
 * Upload một file ảnh và trả về URL đã upload.
 */
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await Upload(formData);
  if (!res?.attachment?.url) {
    throw new Error("Upload thất bại: Không có URL trả về");
  }
  return res.attachment.url;
}

/**
 * Hook xử lý việc upload các ảnh trong nội dung HTML (data:image/...)
 */
export function useUploadImages() {
  const uploadMutation = useMutation({
    mutationFn: uploadImage,
  });

  const processContentWithUploads = async (
    htmlContent: string
  ): Promise<string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgs = doc.querySelectorAll("img");

    const uploadTasks: Promise<void>[] = [];

    for (let img of Array.from(imgs)) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:")) {
        const blob = await fetch(src).then((r) => r.blob());
        const file = new File([blob], `image.${blob.type.split("/")[1]}`, {
          type: blob.type,
        });

        const uploadTask = uploadMutation
          .mutateAsync(file)
          .then((url) => {
            img.setAttribute("src", url);
          })
          .catch((error) => {
            console.error("Lỗi upload ảnh:", error);
            // Tuỳ xử lý nếu muốn fallback
          });

        uploadTasks.push(uploadTask);
      }
    }

    await Promise.all(uploadTasks);
    return doc.body.innerHTML;
  };

  return {
    processContentWithUploads,
    isUploading: uploadMutation.isPending,
  };
}
