// Tích hợp đầy đủ TopicsPage với phân trang mượt mà, Framer Motion và React Query

import { Button, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { GetAllTopics } from "../services/TopicServices";
import { GetAllTags } from "../services/TagServices";
import { TopicResponse } from "../store/interfaces/topicInterfaces";
import { TagResponse } from "../store/interfaces/tagInterfaces";
import { useFollowItem } from "../hooks/follows/useFollowItem";

import CardItem from "../components/Common/Card/CardItem";
import CardList from "../components/Common/Card/CardList";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import EmptyState from "../components/Common/EmptyState";
import Pagination from "../components/Common/Pagination/Pagination";
import { GetFollowedTopics } from "../services";

const PAGE_SIZE = 12;

const TopicsPage = () => {
  const { onOpen } = useDisclosure();
  const [topicPage, setTopicPage] = useState(1);
  const [tagPage, setTagPage] = useState(1);

  const {
    data: topicData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["topics", topicPage],
    queryFn: () => GetAllTopics({ limit: PAGE_SIZE, page: topicPage }),
  });

  const { data: followedTopics = [], isLoading: isLoadingFollowed } = useQuery({
    queryKey: ["topic-follows"],
    queryFn: GetFollowedTopics,
  });

  const {
    data: tagData,
    isLoading: tagsLoading,
    isError: tagsIsError,
    error: tagsError,
    refetch: refetchTags,
  } = useQuery({
    queryKey: ["tags", tagPage],
    queryFn: () => GetAllTags({ limit: PAGE_SIZE, page: tagPage }),
  });

  const topics = topicData?.topics || [];
  const tags = tagData?.tags || [];

  const handleTopicPageChange = (newPage: number) => {
    setTopicPage(newPage);
    document
      .getElementById("discover-topics")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTagPageChange = (newPage: number) => {
    setTagPage(newPage);
    document
      .getElementById("discover-tags")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-auto">
      <div className="p-4 w-full max-w-screen-xl mx-auto flex">
        <div className="basis-4/6 pr-4">
          {/* Chủ đề của bạn */}
          <div className="bg-content1 rounded-md p-4 mr-5 mb-5">
            <h2 className="text-base font-semibold">Chủ đề của bạn</h2>

            <div className="p-4">
              {isLoadingFollowed ? (
                <LoadingState message="Đang tải chủ đề..." />
              ) : isError ? (
                <ErrorState
                  message={error?.message || "Không thể tải chủ đề"}
                  onRetry={refetch}
                />
              ) : followedTopics.length > 0 ? (
                <div className="mt-0 space-y-2">
                  {followedTopics.map((topic: TopicResponse) => (
                    <div
                      key={topic.id}
                      className="cursor-pointer flex items-center justify-between p-2 bg-content1 rounded-md hover:bg-content3 transition-colors duration-200"
                    >
                      <span className="ml-2 text-sm">{topic.name}</span>
                      <span className="text-xs text-gray-400 mr-2">ADMIN</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Chưa có chủ đề nào"
                  description="Bạn sẽ nhận được nhiều câu hỏi hơn nếu thêm các chủ đề cụ thể."
                  icon="lucide:mailbox"
                  actionLabel="Thêm chủ đề"
                  onAction={onOpen}
                />
              )}
            </div>
          </div>

          {/* Khám phá chủ đề */}
          <div className="mt-6" id="discover-topics">
            <h2 className="text-base font-semibold">Khám phá chủ đề</h2>
            <p className="mt-2 text-gray-400 mb-4 text-sm">
              Những chủ đề bạn có thể thích
            </p>

            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState
                message={error?.message || "Không thể tải chủ đề"}
                onRetry={refetch}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={topicPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CardList
                      items={topics}
                      renderItem={(topic: TopicResponse) => {
                        const { isFollowing, handleToggleFollow, isPending } =
                          useFollowItem(topic.id, "topics");

                        return (
                          <CardItem
                            key={topic.id}
                            id={topic.id}
                            name={topic.name}
                            description={topic.description || ""}
                          >
                            <Button
                              size="sm"
                              radius="full"
                              variant={isFollowing ? "flat" : "bordered"}
                              onPress={handleToggleFollow}
                              isLoading={isPending}
                              className="text-xs font-semibold"
                            >
                              <Icon
                                icon="lucide:message-square"
                                className="w-4 h-4"
                              />
                              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                              <span className="ml-1 text-gray-400">
                                · {topic.followersCount}
                              </span>
                            </Button>
                          </CardItem>
                        );
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
                <Pagination
                  page={topicPage}
                  pageSize={PAGE_SIZE}
                  total={topicData?.total || 0}
                  onChange={handleTopicPageChange}
                />
              </>
            )}
          </div>

          {/* Khám phá thẻ */}
          <div className="mt-6" id="discover-tags">
            <h2 className="text-lg font-semibold">Khám phá thẻ</h2>
            <p className="mt-2 text-gray-400 mb-2">
              Những thẻ bạn có thể thích
            </p>

            {tagsLoading ? (
              <LoadingState />
            ) : tagsIsError ? (
              <ErrorState
                message={tagsError?.message || "Không thể tải thẻ"}
                onRetry={refetchTags}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tagPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CardList
                      items={tags}
                      renderItem={(tag: TagResponse) => (
                        <CardItem
                          key={tag.id}
                          id={tag.id}
                          name={tag.name}
                          description={tag.description || ""}
                        />
                      )}
                    />
                  </motion.div>
                </AnimatePresence>
                <Pagination
                  page={tagPage}
                  pageSize={PAGE_SIZE}
                  total={tagData?.total || 0}
                  onChange={handleTagPageChange}
                />
              </>
            )}
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="basis-2/6 pl-4">
          <div className="bg-content1 rounded-md p-4 h-[200px]">
            <h3 className="font-semibold mb-4">Lời mời đang chờ</h3>
            <div className="text-center opacity-60">Chưa có lời mời nào</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
