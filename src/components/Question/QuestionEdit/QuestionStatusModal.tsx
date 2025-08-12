// components/Question/QuestionEdit/QuestionStatusModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { useUpdateInteractionStatus } from "../../../hooks/questions/useUpdateInteractionStatus";
import { FaChevronDown, FaCheck } from "react-icons/fa";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { updateInteractionStatus, isUpdatingInteractionStatus } =
    useUpdateInteractionStatus();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleUpdate = () => {
    updateInteractionStatus(
      { id: questionId, interaction_status: status },
      {
        onSuccess: () => onOpenChange(), // Close modal only on success
      }
    );
  };

  const statuses = [
    { value: "opened", label: "Đang thảo luận" },
    { value: "closed", label: "Đóng" },
    { value: "solved", label: "Đã giải quyết" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="relative">
      <ModalContent className="max-w-md">
        <ModalHeader className="text-lg font-bold border-b border-default-200 py-2">
          Cập nhật trạng thái câu hỏi
        </ModalHeader>
        <ModalBody className="py-4 relative">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Chọn trạng thái
            </label>
            <div className="relative" ref={menuRef}>
              <Button
                onPress={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="flex items-center justify-between w-full text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                variant="bordered"
              >
                <span>
                  {statuses.find((s) => s.value === status)?.label ||
                    "Chọn trạng thái"}
                </span>
                <FaChevronDown className="w-4 h-4" />
              </Button>
              {isMenuOpen && (
                <div className="fixed z-50 w-fit mt-1 bg-content1 rounded-lg shadow-lg border border-default-200">
                  {statuses.map((s) => (
                    <Button
                      key={s.value}
                      onPress={() => {
                        setStatus(s.value);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-none first:rounded-t-lg last:rounded-b-lg ${
                        status === s.value ? "bg-content3" : ""
                      } hover:bg-content1  transition-all duration-200`}
                      variant="light"
                    >
                      <div className="flex items-center gap-2">
                        {status === s.value && <FaCheck className="w-4 h-4" />}
                        {s.label}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="">
          <Button
            color="default"
            size="sm"
            variant="light"
            onPress={() => {
              onOpenChange();
            }}
            className="text-sm font-semibold px-4 py-2"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            color="primary"
            onPress={() => {
              handleUpdate();
            }}
            isLoading={isUpdatingInteractionStatus}
            className="text-sm font-semibold px-4 py-2 ml-2"
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionStatusModal;
