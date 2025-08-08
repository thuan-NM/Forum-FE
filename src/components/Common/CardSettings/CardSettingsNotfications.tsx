import React from "react";
import { cn } from "../../../lib/utils";
import { Button, Divider, Switch } from "@heroui/react";

interface CardSettingsNotificationsProps {
  icon?: string;
  title: string;
  description?: string;
  item: {
    name: string;
    description: string;
  }[];
  className?: string;
  isShowManage?: boolean;
  manageButtonTitle?: string;
  manageButtonDescription?: string;
}
const CardSettingsNotifications: React.FC<CardSettingsNotificationsProps> = ({
  title,
  item,
  className,
  isShowManage = false,
  manageButtonTitle,
  manageButtonDescription,
}) => {
  return (
    <div>
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <div className="flex flex-col justify-between">
          {item.map((item, index) => (
            <div
              key={index}
              className={cn("flex items-center py-1.5", className)}
            >
              <div className="flex items-center gap-4 w-full">
                <Switch size="sm" />
                <div className="flex flex-col">
                  {item.name}
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isShowManage && (
          <div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                {manageButtonTitle}
                <p className="text-xs text-gray-400">
                  {manageButtonDescription}
                </p>
              </div>
              <Button
                variant="bordered"
                color="primary"
                radius="full"
                className="w-fit
                hover:bg-primary-100"
              >
                Manage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSettingsNotifications;
