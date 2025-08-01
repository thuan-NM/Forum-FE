// components/Question/QuestionEdit/QuestionStatusModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import {} from "../../../hooks/questions/useUpdateInteractionStatus"
interface QuestionStatusModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  questionId: string;
  currentStatus: string;
}

const QuestionStatusModal = ({
  isOpen,
  onOpenChange,
  questionId,
  currentStatus,
}: QuestionStatusModalProps) => {
  const [status, setStatus] = useState(currentStatus);
  const { updateInteractionStatus, isUpdatingInteractionStatus } =
    useUpdateInteractionStatus();

  const handleUpdate = () => {
    updateInteractionStatus(
      { id: questionId, interaction_status: status },
      {
        onSuccess: () => onOpenChange(), // Close modal only on success
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Cập nhật trạng thái câu hỏi</ModalHeader>
        <ModalBody>
          <Select
            label="Trạng thái"
            defaultSelectedKeys={[status]}
            onChange={(e) => setStatus(e.target.value)}
          >
            <SelectItem key="opened">Opened</SelectItem>
            <SelectItem key="closed">Closed</SelectItem>
            <SelectItem key="solved">Solved</SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onOpenChange}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleUpdate}
            isLoading={isUpdatingInteractionStatus}
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionStatusModal;
