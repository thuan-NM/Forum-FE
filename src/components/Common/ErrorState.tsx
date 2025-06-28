import React from "react";
import { Button } from "@heroui/react";
import { GoAlertFill } from "react-icons/go";

interface ErrorStateProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  retryLabel = "Try Again",
  onRetry,
}) => {
  return (
    <div className="p-6 bg-danger-50 text-danger-500 rounded-md flex flex-col items-center text-center">
      <GoAlertFill className="w-12 h-12 mb-4" />
      <p className="mb-4">{message}</p>
      {onRetry && (
        <Button color="danger" variant="flat" onPress={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
