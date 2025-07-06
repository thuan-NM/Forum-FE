"use client";

import React from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { cn } from "../../lib/utils";

export type MoreAction = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

interface MoreActionsPopoverProps {
  actions: MoreAction[];
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  placement?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  buttonClassName?: string;
  contentClassName?: string;
  triggerIconClassName?: string;
}

const MoreActionsPopover: React.FC<MoreActionsPopoverProps> = ({
  actions,
  className,
  iconOnly = true,
  size = "sm",
  placement = "top-start",
  buttonClassName,
  contentClassName,
  triggerIconClassName,
}) => {
  return (
    <Popover placement={placement}>
      <PopoverTrigger className={cn("flex items-center", className)}>
        <Button
          size={size}
          variant="flat"
          radius="full"
          isIconOnly={iconOnly}
          className={cn("bg-transparent", buttonClassName)}
        >
          <HiOutlineDotsHorizontal
            className={cn("text-lg", triggerIconClassName)}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0 bg-content1 rounded-sm min-w-[150px]",
          contentClassName
        )}
      >
        <div className="flex flex-col w-full">
          {actions.map((action, index) => (
            <Button
              key={index}
              onPress={action.onClick}
              isLoading={action.isLoading}
              disabled={action.disabled}
              className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
              size="sm"
              radius="none"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MoreActionsPopover;
