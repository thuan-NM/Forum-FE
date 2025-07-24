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
import TopicQuestionList from "../components/Topic/TopicDetail/TopicQuestionList";

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
    refetch, // Thêm refetch
  } = useQuery<{
    topic: TopicResponse;
  }>({
    queryKey: ["topic", id?.toString()],
    queryFn: () => GetTopicById(id!),
    refetchOnWindowFocus: false, // Thêm option này để tránh refetch không cần thiết
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
      <div className="flex md:flex-row flex-col-reverse mt-5 gap-x-2 relative">
        <div className="basis-1/4 flex justify-end min-h-[60vh] h-fit ">
          <div className="w-full md:!max-w-xs mx-auto -mt-4 ">
            <TopicTab className="mx-0"/>
          </div>
        </div>
        <div className="md:basis-1/2  relative ">
          <div>
            {topicData && (
              <TopicHeader
                defaultAvatar={defaultAvatar}
                topicData={topicData?.topic}
              />
            )}
            <div className="flex w-full border-b border-default-200 relative">
              {["questions"].map((tab) => (
                <div
                  key={tab}
                  className={`relative px-4 py-2 pt-8 cursor-pointer text-xs font-semibold transition-colors duration-200 select-none ${
                    activeTab === tab ? "text-red-500" : "text-default-500"
                  }`}
                  onClick={() => setActiveTab(tab as "questions")}
                >
                  Các câu hỏi{" "}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-t" />
                  )}
                </div>
              ))}
            </div>
            {topicData && <TopicQuestionList topic={topicData?.topic} />}
          </div>
        </div>
      </div>
    </TopicDetailLayout>
  );
};

export default TopicDetailPage;
