"use client";

import { useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiUpload } from "react-icons/bi";

import { Upload } from "../../services/UploadServices";
import { UpdateUser } from "../../services";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import { useSetUserInfo } from "../../utils/setUserInfo";
interface AvatarUploadProps {
  user: UserResponse;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ user }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // modal loading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const setUserInfo = useSetUserInfo();

  const { mutate: uploadImage } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await Upload(formData); // res.url
      return res.attachment.url;
    },
    onSuccess: (url) => {
      updateAvatar(url);
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Tải ảnh lên thất bại");
    },
  });

  const { mutate: updateAvatar } = useMutation({
    mutationFn: async (url: string) => {
      return await UpdateUser(user?.id, { avatar: url });
    },
    onSuccess: (data) => {
      toast.success("Cập nhật avatar thành công");
      setPreview(data.data.avatar);
      setUserInfo(data.data);
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      setIsLoading(false);
    },
    onError: () => {
      toast.error("Cập nhật người dùng thất bại");
      setIsLoading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl); // Preview tạm
    setIsLoading(true); // mở modal
    uploadImage(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Avatar Upload */}
      <div className="relative w-32 h-32 group">
        <Avatar
          src={
            preview ||
            user?.avatar ||
            "https://img.heroui.chat/image/avatar?w=200&h=200&u=0"
          }
          className="w-full h-full rounded-full object-cover"
          isBordered
        />

        <button
          onClick={triggerFileInput}
          className="absolute bottom-0 w-full h-1/2 rounded-b-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
        >
          <BiUpload className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Modal loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Đang cập nhật ảnh đại diện...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUpload;
