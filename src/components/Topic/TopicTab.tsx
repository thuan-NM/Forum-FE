import { Button, Tooltip, useDisclosure } from "@heroui/react";
import { GrEdit } from "react-icons/gr";
import TopicModal from "./TopicModal";
import { useQuery } from "@tanstack/react-query";
import { GetFollowedTopics } from "../../services";
import NoTopic from "./NoTopic";
import FollowedTopics from "./FollowedTopics";
import TopicSkeleton from "../Skeleton/TopicSkeleton";

const TopicTab = () => {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["topic-follows"],
    queryFn: GetFollowedTopics,
  });

  return (
    <div className="ml-6 w-full mt-4 bg-content1 rounded-md h-fit  ">
      <div className="flex justify-between w-full font-semibold text-base border-b border-content4 py-2 pl-3 items-center">
        <div className="text-sm">Các chủ đề bạn đã theo dõi</div>
        <Tooltip
          content="Add more topics"
          placement="top"
          offset={15}
          closeDelay={0}
        >
          <Button
            isIconOnly
            size="sm"
            variant="faded"
            radius="full"
            className="border-none bg-content2 hover:bg-content3/30 mr-2"
            onPress={onOpen}
          >
            <GrEdit />
          </Button>
        </Tooltip>
      </div>

      {isLoading ? (
        <TopicSkeleton />
      ) : topics.length === 0 ? (
        <NoTopic onOpen={onOpen} />
      ) : (
        <FollowedTopics topics={topics} />
      )}

      <TopicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        followedTopics={topics}
      />
    </div>
  );
};

export default TopicTab;
