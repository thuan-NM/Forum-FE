import React from "react";
import { Chip } from "@heroui/react";

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
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  type = "post",
  variant = "dot",
  size = "sm",
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
    <Chip color={getStatusColor()} variant={variant} size={size}>
      {status}
    </Chip>
  );
};

export default StatusChip;
