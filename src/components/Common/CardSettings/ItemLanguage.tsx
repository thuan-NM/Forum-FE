import React from "react";
import { cn } from "../../../lib/utils";
import { Switch, User } from "@heroui/react";
import Color from "@tiptap/extension-color";

interface ItemLanguageProps {
  acronym: string;
  name: string;
  className?: string;
  primary?: boolean;
}
const ItemLanguage: React.FC<ItemLanguageProps> = ({
  acronym,
  name,
  className,
  primary = false,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("text-xl w-7", className)}>{acronym}</div>
        <div className="text-md">{name}</div>
      </div>
      {primary && <div className="text-md text-gray-500">Primary</div>}
    </div>
  );
};

export default ItemLanguage;
