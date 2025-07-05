"use client";

import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AlertActionProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  iconName?: string; // e.g., "mdi:alert", "ph:trash"
  icon?: ReactNode; // Custom icon
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  loading?: boolean;
  className?: string;
}

const AlertAction: React.FC<AlertActionProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  iconName = "mdi:alert",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  loading = false,
  className,
}) => {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <div
        className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4",
          className
        )}
      >
        <div className="w-full max-w-md bg-white dark:bg-content1 rounded-lg shadow-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {icon || (
                <Icon icon={iconName} className="text-yellow-500 w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onPress={onClose}>
              {cancelText}
            </Button>
            <Button
              color={isDanger ? "danger" : "primary"}
              onPress={onConfirm}
              isLoading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlertAction;
