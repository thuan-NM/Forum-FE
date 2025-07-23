import { Button, Card, Image } from "@heroui/react";
import React from "react";
import { FaRss } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { TopicResponse } from "../../../store/interfaces/topicInterfaces";
import { useFollowTopic } from "../../../hooks/follows/useFollowTopic";

interface TopicHeaderProps {
  defaultAvatar: string;
  topicData: TopicResponse;
}

const TopicHeader: React.FC<TopicHeaderProps> = ({
  defaultAvatar,
  topicData,
}) => {
  const { isFollowing, toggleFollow, isPending } = useFollowTopic(topicData.id);

  const handleToggleFollow = () => {
    toggleFollow();
  };

  return (
    <Card className="bg-content1 !p-4 rounded-md flex flex-row gap-x-4 items-center">
      <Image
        src={defaultAvatar}
        width={90}
        height={90}
        className="rounded-lg"
      />
      <div className="flex flex-col gap-y-3">
        <div className="text-lg font-semibold">{topicData?.name}</div>
        <Button
          size="sm"
          variant={isFollowing ? "bordered" : "light"}
          radius="full"
          className={`w-fit gap-x-[4px] !font-semibold transition-all duration-200 ${isFollowing ? "shadow-md bg-content1" : ""}`}
          onPress={handleToggleFollow}
          isLoading={isPending}
        >
          <FaRss className="w-4 h-4" />
          {isFollowing ? "Following" : "Follow"}
          <GoDotFill className="w-1 h-1 hidden sm:block" />
          {topicData?.followersCount || 0}
        </Button>
      </div>
    </Card>
  );
};

export default TopicHeader;
