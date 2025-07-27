import { Card, CardBody, CardHeader } from "@heroui/react";
import { GetFollowedTopics } from "../../services";
import { useQuery } from "@tanstack/react-query";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";
import LoadingState from "../Common/LoadingState";
import FollowedTopicsItem from "../Topic/FollowedTopicItem";

const KnowAbout = () => {
  const { data: topics = [] as TopicResponse[], isLoading } = useQuery({
    queryKey: ["topic-follows"],
    queryFn: GetFollowedTopics,
  });
  if (isLoading) {
    return <LoadingState message="" />;
  }
  return (
    <Card className="!rounded-md py-3">
      <CardHeader className="flex justify-between items-center px-3 py-0">
        <h3 className="text-md font-semibold">Các chủ đề bạn đang theo dõi</h3>
      </CardHeader>
      <CardBody className="px-0 py-0 mt-3">
        <div className="space-y-1">
          {topics.map((topic) => (
            <FollowedTopicsItem
              className="flex justify-between"
              subDataClassName="text-xs opacity-50"
              key={topic.id}
              topic={topic}
              showButton={true}
              showFollowCount={true}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default KnowAbout;
