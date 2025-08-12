import React from "react";
import { cn } from "../../../lib/utils";
import { Switch } from "@heroui/react";

interface CardSettingsPrivacyProps {
  icon?: string;
  title: string;
  description?: string;
  item: {
    name: string;
  }[];
  className?: string;
  isShowSwitch?: boolean;
}
const CardSettingsPrivacy: React.FC<CardSettingsPrivacyProps> = ({
  title,
  item,
  className,
  isShowSwitch = false,
}) => {
  return (
    <div>
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <div className="flex flex-col justify-between">
          {item.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center py-1.5 cursor-pointer",
                className
              )}
            >
              <div className="flex items-center justify-between w-full">
                {item.name}
                {isShowSwitch && <Switch defaultSelected size="sm" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSettingsPrivacy;
