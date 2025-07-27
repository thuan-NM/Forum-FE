"use client";

import { useRef, useState } from "react";
import {
  Avatar,
  Modal,
  ModalContent,
  Button,
  Image,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiUpload, BiImageAdd, BiX } from "react-icons/bi"; // Thêm BiImageAdd cho icon đẹp hơn

import { Upload } from "../../services/UploadServices";
import { UpdateUser } from "../../services";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import { useSetUserInfo } from "../../utils/setUserInfo";

interface AvatarUploadProps {
  user: UserResponse;
  isMe?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ user, isMe = true }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const setUserInfo = useSetUserInfo();

  const { mutate: uploadImage } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await Upload(formData);
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
      onClose();
    },
    onError: () => {
      toast.error("Cập nhật người dùng thất bại");
      setIsLoading(false);
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      setIsLoading(true);
      uploadImage(selectedFile);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    onClose();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
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
        {isMe && (
          <Button
            onPress={() => {
              onOpen();
              console.log(isOpen); // Lưu ý: Log này sẽ luôn là giá trị cũ (false), vì state update async. Để debug chính xác, thêm console.log(isOpen) trong return hoặc useEffect.
            }}
            className="absolute bottom-0 w-full h-1/2 rounded-b-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
          >
            <BiUpload className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-md">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">
              Chọn và tải lên ảnh đại diện
            </h3>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-4">
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 rounded-full object-cover"
                  />
                  <Button
                    onPress={() => {
                      setPreview(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 z-50"
                    variant="solid"
                    color="danger"
                    isIconOnly
                    radius="full"
                    isDisabled={isLoading}
                  >
                    <BiX className="w-6 h-6 text-white font-semibold" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onPress={triggerFileInput}
                    color="default"
                    variant="bordered"
                    isIconOnly // Làm nút outline để đẹp hơn, hiện đại
                    startContent={
                      <BiImageAdd className="w-12 h-12 text-default-300" />
                    } // Thêm icon bên trái
                    className="mb-4 size-32 text-base font-medium hover:shadow-md  hover:scale-105 transition-all" // Tăng padding, font, hover effect
                  ></Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="pt-0">
            <Button
              onPress={handleCancel}
              color="default"
              disabled={isLoading}
              size="sm"
            >
              Hủy
            </Button>
            <Button
              onPress={handleSubmit}
              isLoading={isLoading}
              color="primary"
              className="mr-2"
              disabled={!selectedFile}
              size="sm"
            >
              {isLoading ? "Đang tải..." : "Tải lên"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AvatarUpload;
