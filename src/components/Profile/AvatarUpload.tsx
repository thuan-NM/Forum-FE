"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { ClientUploadedFileData } from "uploadthing/types";
import { Avatar } from "@heroui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../store/hooks";
import { BiUpload } from "react-icons/bi";

const AvatarUpload = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const [preview, setPreview] = useState<string | null>(null);

  const updateAvatar = useMutation({
    mutationFn: async (url: string) => {
      const res = await axios.put(
        `/api/users/${user?.id}`,
        { avatar: url },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return res.data;
    },
    onSuccess: () => toast.success("Cập nhật avatar thành công!"),
    onError: () => toast.error("Lỗi khi cập nhật avatar"),
  });

  return (
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

      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-br-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(
            res: ClientUploadedFileData<{ uploadedBy: string }>[]
          ) => {
            if (!res || !res[0]) return;
            setPreview(res[0].url);
            updateAvatar.mutate(res[0].url);
          }}
          onUploadError={() => toast.error("Upload thất bại")}
          appearance={{
            container: "absolute inset-0",
            button: "w-full h-full opacity-0 cursor-pointer",
            allowedContent: "hidden",
          }}
        />
        <BiUpload className="w-4 h-4 absolute z-10" />
      </div>
    </div>
  );
};

export default AvatarUpload;
