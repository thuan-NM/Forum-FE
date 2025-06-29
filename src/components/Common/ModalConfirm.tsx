import React, { useState } from "react";
import { Button } from "@heroui/react";

interface ConfirmableModalProps {
  trigger: React.ReactNode;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const ConfirmableModal: React.FC<ConfirmableModalProps> = ({
  trigger,
  title = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[260px]">
            <div className="text-sm mb-3">{title}</div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="light"
                onClick={() => setIsOpen(false)}
              >
                {cancelText}
              </Button>
              <Button size="sm" color="danger" onClick={handleConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmableModal;
