import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

interface ConfirmableActionProps {
  trigger: React.ReactNode;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const ConfirmableAction: React.FC<ConfirmableActionProps> = ({
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
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className="p-4 w-[260px]" >
        <div className="text-sm mb-3">{title}</div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="light" onClick={() => setIsOpen(false)}>
            {cancelText}
          </Button>
          <Button size="sm" color="danger" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmableAction;
