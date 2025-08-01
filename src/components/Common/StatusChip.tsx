import React from "react";
import { Chip } from "@heroui/react";
import { cn } from "../../lib/utils";

interface StatusChipProps {
  status: string;
  type?:
    | "user"
    | "post"
    | "comment"
    | "question"
    | "answer"
    | "report"
    | "interaction_status";
  variant?: "flat" | "solid" | "bordered" | "dot";
  size?: "sm" | "md" | "lg";
  className?: string;
  color?:
    | "success"
    | "warning"
    | "danger"
    | "default"
    | "secondary"
    | "primary"
    | undefined;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  type = "post",
  variant = "dot",
  size = "sm",
  className,
  color,
}) => {
  const getStatusColor = () => {
    if (type === "user") {
      switch (status.toLowerCase()) {
        case "active":
          return "success";
        case "inactive":
          return "warning";
        case "banned":
          return "danger";
        default:
          return "default";
      }
    }

    if (type === "post") {
      switch (status.toLowerCase()) {
        case "approved":
          return "success";
        case "pending":
          return "warning";
        case "rejected":
          return "danger";
        default:
          return "default";
      }
    }

    if (type === "comment") {
      switch (status.toLowerCase()) {
        case "approved":
          return "success";
        case "pending":
          return "warning";
        case "spam":
          return "secondary";
        case "rejected":
          return "danger";
        default:
          return "default";
      }
    }

    if (type === "interaction_status") {
      switch (status.toLowerCase()) {
        case "opened":
          return "primary";
        case "closed":
          return "danger";
        case "solved":
          return "success";
        default:
          return "default";
      }
    }
    if (type === "question") {
      switch (status.toLowerCase()) {
        case "approved":
          return "success";
        case "pending":
          return "warning";
        case "rejected":
          return "danger";
        case "accepted":
          return "secondary";
        default:
          return "default";
      }
    }

    if (type === "answer") {
      switch (status.toLowerCase()) {
        case "approved":
          return "success";
        case "pending":
          return "warning";
        case "rejected":
          return "danger";
        case "accepted":
          return "secondary";
        default:
          return "default";
      }
    }

    if (type === "report") {
      switch (status.toLowerCase()) {
        case "pending":
          return "warning";
        case "resolved":
          return "success";
        case "dismissed":
          return "default";
        default:
          return "default";
      }
    }

    return "default";
  };

  return (
    <Chip
      color={color ? color : getStatusColor()}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      {status}
    </Chip>
  );
};

export default StatusChip;
