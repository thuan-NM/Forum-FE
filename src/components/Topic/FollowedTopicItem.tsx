import { Button, Image } from "@heroui/react";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";
import { useNavigate } from "react-router-dom";
import { useFollowItem } from "../../hooks/follows/useFollowItem";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "../../lib/utils";
import { useFollowTopic } from "../../hooks/follows/useFollowTopic";
import TopicSkeleton from "../Skeleton/TopicSkeleton";

interface FollowedTopicsItemProps {
  topic: TopicResponse;
  showButton?: boolean;
  className?: string;
  showFollowCount?: boolean;
  subDataClassName?: string;
}

const FollowedTopicsItem: React.FC<FollowedTopicsItemProps> = ({
  topic,
  showButton = false,
  className,
  showFollowCount = false,
  subDataClassName,
}) => {
  const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    topic.name
  )}`;
  const navigate = useNavigate();
  const { toggleFollow, isPending } = useFollowTopic(topic.id);

  const handleClick = () => {
    navigate(`/topics/${topic.id}`);
  };

  return (
    <div className="flex items-center justify-between rounded-md w-full">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 group py-2 hover:bg-content4/20 cursor-pointer w-full px-3",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Image
            src={avatarUrl}
            alt={topic.name}
            width={32}
            height={32}
            className="rounded-md "
          />{" "}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium group-hover:underline">
              {topic.name}
            </span>
            {showFollowCount && (
              <div className={cn(subDataClassName)}>
                {topic.followersCount} người theo dõi
              </div>
            )}
          </div>
        </div>
        {showButton && (
          <Button
            size="sm"
            variant="flat"
            radius="full"
            isLoading={isPending}
            onPress={toggleFollow}
            className="text-xs font-semibold"
          >
            <Icon icon="lucide:user-minus" className="w-4 h-4" />
            Bỏ theo dõi
          </Button>
        )}
      </div>
    </div>
  );
};

export default FollowedTopicsItem;
