import { TopicResponse } from "../../store/interfaces/topicInterfaces";
import FollowedTopicsItem from "./FollowedTopicItem";

interface FollowedTopicProps {
  topics: TopicResponse[];
}
const FollowedTopics: React.FC<FollowedTopicProps> = ({ topics }) => {
  return (
    <div className="flex flex-col justify-start items-start py-4">
      {topics.map((topic) => (
        <FollowedTopicsItem key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

export default FollowedTopics;
