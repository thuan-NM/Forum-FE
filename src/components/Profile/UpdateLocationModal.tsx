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
import { useUpdateUser } from "../../hooks/users/useEditUser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation: string;
  userId: string;
  refetch?: () => void;
}

const UpdateLocationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultLocation,
  userId,
  refetch,
}) => {
  const [location, setLocation] = useState(defaultLocation);

  const { UpdateUser, isUpdating } = useUpdateUser(() => onClose());

  const handleSave = async () => {
    await UpdateUser(userId, { location: location });
    refetch?.();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>Cập nhật vị trí</ModalHeader>
        <ModalBody>
          <Input
            label="Địa chỉ"
            placeholder="Nhập địa chỉ của bạn"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            disabled={isUpdating}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            disabled={isUpdating}
            size="sm"
          >
            Hủy
          </Button>
          <Button
            onPress={handleSave}
            color="primary"
            isLoading={isUpdating}
            size="sm"
          >
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateLocationModal;
