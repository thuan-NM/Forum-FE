"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangePassword, UpdateUser } from "../../../services";
import { UserResponse } from "../../../store/interfaces/userInterfaces";
import { useUpdateUser } from "../../../hooks/users/useEditUser";
import { useSetUserInfo } from "../../../utils/setUserInfo";
import { useLogoutMutation } from "../../../hooks/users/useLogoutMutation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
  refetch: () => void;
}

const EditUserInfoModal = ({ isOpen, onClose, user, refetch }: Props) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const setUserInfo = useSetUserInfo();
  const { logoutAccount } = useLogoutMutation();

  const { UpdateUser, isUpdating } = useUpdateUser();
  const changePasswordMutation = useMutation({
    mutationFn: ChangePassword,
    onSuccess: () => toast.success("Đổi mật khẩu thành công!"),
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Lỗi khi đổi mật khẩu.";
      toast.error(msg);
    },
  });

  const handleSave = async () => {
    let isPasswordChanged = false;

    if (showChangePassword) {
      if (!oldPassword || !newPassword) {
        toast.error("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.");
        return;
      }

      try {
        await changePasswordMutation.mutateAsync({
          oldPassword,
          newPassword,
        });
        isPasswordChanged = true;
      } catch {
        return; // Nếu đổi mật khẩu lỗi thì không update info
      }
    }

    try {
      const res = await UpdateUser(user.id, { full_name: fullName, username });

      if (isPasswordChanged) {
        // Nếu đổi mật khẩu, logout luôn
        logoutAccount();
        toast.success("Vui lòng đăng nhập lại!");
      } else {
        // Nếu không đổi mật khẩu, cập nhật dữ liệu người dùng (local + query)
        refetch();
        setUserInfo(res?.data); // cập nhật localStorage
        toast.success("Cập nhật thông tin thành công!");
      }

      onClose();
      setShowChangePassword(false);
    } catch (error) {
      // lỗi khi update user
      console.error(error);
    }
  };

  const isLoading = isUpdating || changePasswordMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setShowChangePassword(false);
      }}
      size="md"
      backdrop="blur"
    >
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      > */}
      <ModalContent className="bg-content1 backdrop-blur-md border border-content2 shadow-xl rounded-xl">
        <ModalHeader className="text-xl font-bold flex items-center gap-2">
          <Icon icon="lucide:user-cog" className="text-blue-500" />
          Chỉnh sửa thông tin cá nhân
        </ModalHeader>

        <ModalBody className="space-y-4">
          <Input
            label="Email"
            value={user.email}
            isDisabled
            className="opacity-70 cursor-not-allowed"
          />
          <Input
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <AnimatePresence>
            {showChangePassword && (
              <motion.div
                className="space-y-4 flex flex-col gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!showChangePassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="flat"
                onPress={() => setShowChangePassword(true)}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-0 w-full"
              >
                <Icon icon="lucide:lock" className="size-4" />
                Đổi mật khẩu
              </Button>
            </motion.div>
          )}
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button
            variant="light"
            onPress={() => {
              onClose();
              setShowChangePassword(false);
            }}
            className="hover:bg-default-100"
            size="sm"
          >
            Hủy
          </Button>
          <Button
            onPress={handleSave}
            isLoading={isLoading}
            size="sm"
            className={cn(
              "bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold hover:from-pink-600 hover:to-red-600",
              "transition-all shadow-md hover:shadow-lg"
            )}
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
      {/* </motion.div> */}
    </Modal>
  );
};

export default EditUserInfoModal;
