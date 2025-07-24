import React from "react";
import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";
import { GetFollowedTopics } from "../../services";
import { useQuery } from "@tanstack/react-query";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";
import { useNavigate } from "react-router-dom";

const KnowAbout = () => {
  const { data: topics = [] as TopicResponse[], isLoading } = useQuery({
    queryKey: ["topic-follows"],
    queryFn: GetFollowedTopics,
  });
  const navigate = useNavigate();
  return (
    <Card className="rounded-md py-3">
      <CardHeader className="flex justify-between items-center px-3 py-0">
        <h3 className="text-md font-semibold">Các chủ đề bạn đang theo dõi</h3>
      </CardHeader>
      <CardBody className="px-0 py-0 mt-3">
        <div className="space-y-1">
          {topics.map((topic, index) => (
            <div
              key={index}
              onClick={() => navigate(`/topics/${topic.id}`)}
              className="flex items-center gap-4 cursor-pointer group hover:bg-content4/20 rounded-none px-4 py-1"
            >
              <Avatar
                src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${index + 2}`}
                size="sm"
              />
              <div>
                <p className="text-sm font-semibold group-hover:underline">
                  {topic.name}
                </p>
                <p className="text-sm text-default-500">
                  {topic.questionsCount} câu hỏi
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default KnowAbout;
