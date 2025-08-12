import { useQuery } from "@tanstack/react-query";
import { GetAllTopics } from "../../services";
import { Button, Skeleton } from "@heroui/react";
import { BsMailbox } from "react-icons/bs";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";
interface FollowedTopicProps {
  followedTopics: TopicResponse[];
}
const TopicList: React.FC<FollowedTopicProps> = ({
  followedTopics = [],
}: {
  followedTopics: TopicResponse[];
}) => {
  const {
    data: topics,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: () =>
      GetAllTopics({
        limit: 1000,
      }),
  });
  console.log(followedTopics);

  const allTopics = topics?.topics || [];
  const unfollowedTopics = allTopics.filter(
    (topic: TopicResponse) => !followedTopics.some((f) => f.id === topic.id)
  );
  if (isLoading) {
    return (
      <div className="my-3 text-center w-5/6">
        <Skeleton className="w-full h-5 !rounded-full" />
        <Skeleton className="w-full h-5 mt-2 !rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  if (unfollowedTopics.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex justify-center flex-col my-2 gap-y-1 mx-auto py-12 px-2">
          <BsMailbox className="w-10 h-10 opacity-60 mx-auto" />
          <div className="mx-auto font-bold text-sm opacity-60">
            Bạn đã theo dõi tất cả các chủ đề
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3">
      {unfollowedTopics.map((topic: TopicResponse) => (
        <div
          key={topic.id}
          className="flex justify-between items-center px-3 py-2 hover:bg-content2/30 rounded-md"
        >
          <span className="text-sm">{topic.name}</span>
          <Button
            size="sm"
            variant="faded"
            onClick={() => {}}
          >
            Thêm
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TopicList;
