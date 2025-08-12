import {  Card, Image } from "@heroui/react";
import React from "react";
import { TagResponse } from "../../../store/interfaces/tagInterfaces";

interface TopicHeaderProps {
  defaultAvatar: string;
  tagData: TagResponse;
}

const TagHeader: React.FC<TopicHeaderProps> = ({ defaultAvatar, tagData }) => {
  return (
    <Card className="bg-content1 !p-4 rounded-md flex flex-row gap-x-4 items-center w-full">
      <Image
        src={defaultAvatar}
        width={90}
        height={90}
        className="rounded-lg min-w-[90px] min-h-[90px] max-w-[90px] max-h-[90px]"
      />
      <div className="flex flex-col gap-y-3">
        <div className="text-lg font-semibold flex line-clamp-1 text-ellipsis capitalize">
          {tagData?.name}
        </div>
        <div className="line-clamp-2 text-sm dark:text-white/70 light:text-black/70">
          {tagData?.description}{" "}
        </div>
      </div>
    </Card>
  );
};

export default TagHeader;
