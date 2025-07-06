import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GetTopicById } from "../services";
import { TopicResponse } from "../store/interfaces/topicInterfaces";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import TopicTab from "../components/Topic/TopicTab";
import TopicDetailLayout from "../layouts/TopicDetailLayout";

import TopicHeader from "../components/Topic/TopicDetail/TopicHeader";
import { useState } from "react";
import { Button } from "@heroui/react";
import QuestionList from "../components/Question/QuestionList";
import AnswerList from "../components/Answer/AnswerList";
import TopicAnswerList from "../components/Topic/TopicDetail/TopicAnswerList";

const TopicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"questions" | "answers">(
    "questions"
  );

  const {
    data: topicData,
    isLoading,
    isError,
    error,
  } = useQuery<{
    topic: TopicResponse;
  }>({
    queryKey: ["topic", id],
    queryFn: () => GetTopicById(id!),
  });
  const defaultAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    topicData?.topic?.name || ""
  )}`;

  if (isLoading) {
    return <LoadingState message="Đang tải dữ liệu chủ đề..." />;
  }
  if (isError) {
    return <ErrorState message={error.message || "Lỗi khi tải chủ đề"} />;
  }
  return (
    <TopicDetailLayout>
      <div className="flex flex-row mt-5 gap-x-2">
        <div className="basis-1/4 flex justify-end min-h-[60vh] h-fit ">
          <div className="w-full !max-w-xs mx-auto -mt-4">
            <TopicTab />
          </div>
        </div>
        <div className="basis-2/5">
          <div>
            {topicData && (
              <TopicHeader
                defaultAvatar={defaultAvatar}
                topicData={topicData?.topic}
              />
            )}
            <div className="flex w-full border-b border-default-200 relative">
              {["questions", "answers"].map((tab) => (
                <div
                  key={tab}
                  className={`relative px-4 py-2 pt-8 cursor-pointer text-xs font-semibold transition-colors duration-200 ${
                    activeTab === tab ? "text-red-500" : "text-default-500"
                  }`}
                  onClick={() => setActiveTab(tab as "questions" | "answers")}
                >
                  {tab === "questions" ? "Questions" : "Answers"}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-t" />
                  )}
                </div>
              ))}
            </div>
            <div className="">
              {activeTab === "questions" ? (
                <QuestionList />
              ) : (
                <TopicAnswerList />
              )}
            </div>
          </div>
        </div>
      </div>
    </TopicDetailLayout>
  );
};

export default TopicDetailPage;
