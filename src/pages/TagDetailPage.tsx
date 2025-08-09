import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GetTagById } from "../services";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import TopicTab from "../components/Topic/TopicTab";
import TopicDetailLayout from "../layouts/TopicDetailLayout";

import { useState } from "react";
import TagAnswerList from "../components/Tag/TagDetail/TagAnswerList";
import { TagResponse } from "../store/interfaces/tagInterfaces";
import TagHeader from "../components/Tag/TagDetail/TagHeader";
import TagPostList from "../components/Tag/TagDetail/TagPostList";

const TagDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "answers">("posts");

  const {
    data: tagData,
    isLoading,
    isError,
    error,
  } = useQuery<{
    tag: TagResponse;
  }>({
    queryKey: ["tag", id!],
    queryFn: () => GetTagById(id!),
  });
  console.log(tagData);
  const defaultAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    tagData?.tag?.name || ""
  )}`;

  if (isLoading) {
    return <LoadingState message="Đang tải dữ liệu nhãn..." />;
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
        <div className="!basis-2/5 flex flex-col ">
          {" "}
          <div>
            {tagData && (
              <TagHeader defaultAvatar={defaultAvatar} tagData={tagData?.tag} />
            )}
            <div className="flex w-full border-b border-default-200 relative">
              {["posts", "answers"].map((tab) => (
                <div
                  key={tab}
                  className={`relative px-4 py-2 pt-8 cursor-pointer text-xs font-semibold transition-colors duration-200 ${
                    activeTab === tab ? "text-red-500" : "text-default-500"
                  }`}
                  onClick={() => setActiveTab(tab as "posts" | "answers")}
                >
                  {tab === "posts" ? "Các bài viết" : "Các câu trả lời"}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-t" />
                  )}
                </div>
              ))}
            </div>
            <div className="">
              {activeTab === "posts"
                ? tagData && <TagPostList tag={tagData?.tag} />
                : tagData && <TagAnswerList tag={tagData?.tag} />}
            </div>
          </div>
        </div>
      </div>
    </TopicDetailLayout>
  );
};

export default TagDetailPage;
