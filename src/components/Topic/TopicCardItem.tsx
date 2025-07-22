// components/Topic/TopicCardItem.tsx
"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";
import { useFollowItem } from "../../hooks/follows/useFollowItem";
import CardItem from "../Common/Card/CardItem";

interface Props {
  topic: TopicResponse;
}

const TopicCardItem = ({ topic }: Props) => {
  const { isFollowing, handleToggleFollow, isPending } = useFollowItem(
    topic.id,
    "topics"
  );

  return (
    <CardItem
      id={topic.id}
      name={topic.name}
      description={topic.description}
      type="topics"
    >
      <Button
        size="sm"
        radius="full"
        variant={isFollowing ? "flat" : "solid"}
        onPress={handleToggleFollow}
        isLoading={isPending}
        className="text-xs font-semibold"
      >
        <Icon icon="lucide:user-plus" className="w-4 h-4 mr-1" />
        {isFollowing ? "Đang theo dõi" : "Theo dõi"}
      </Button>
    </CardItem>
  );
};

export default TopicCardItem;
