import { Image } from "@heroui/react";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";

const FollowedTopicsItem = ({ topic }: { topic: TopicResponse }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    topic.name
  )}`;

  return (
    <div className="flex items-center justify-between rounded-md w-full">
      <div className="flex items-center gap-3 group py-2 hover:bg-content4/20 cursor-pointer w-full px-3">
        <Image
          src={avatarUrl}
          alt={topic.name}
          width={32}
          height={32}
          className="rounded-md "
        />
        <span className="text-xs font-medium group-hover:underline">
          {topic.name}
        </span>
      </div>
    </div>
  );
};

export default FollowedTopicsItem;
