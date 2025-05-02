import React from "react";
import clsx from "clsx";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export default function ToolbarButton({
  icon,
  onClick,
  isActive,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "p-1 rounded transition-colors mx-1",
        isActive
          ? "bg-content3 text-white"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
    >
      {icon}
    </button>
  );
}
