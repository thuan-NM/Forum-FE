"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDisclosure, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import { GetAllTopics, GetFollowedTopics } from "../services";
import { TopicResponse } from "../store/interfaces/topicInterfaces";
import { useFollowTopic } from "../hooks/follows/useFollowTopic";

import CardList from "../components/Common/Card/CardList";
import CardItem from "../components/Common/Card/CardItem";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import TopicModal from "../components/Topic/TopicModal";
import NoTopic from "../components/Topic/NoTopic";
import TagSkeleton from "../components/Skeleton/TagSkeleton";
import FollowedTopicsItem from "../components/Topic/FollowedTopicItem";

const PAGE_SIZE = 12;

const TopicsPage = () => {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const [allTopics, setAllTopics] = useState<TopicResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Query danh sách chủ đề
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["topics", currentPage],
    queryFn: () => GetAllTopics({ limit: PAGE_SIZE, page: currentPage }),
  });

  useEffect(() => {
    if (data?.topics) {
      setAllTopics((prev) => [...prev, ...data.topics]);

      const totalLoaded = allTopics.length + data.topics.length;
      if (totalLoaded >= data.total) {
        setHasMore(false);
      }
    }
  }, [data]);

  const fetchMoreData = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Query các chủ đề đang theo dõi
  const {
    data: followedTopics = [],
    isLoading: isLoadingFollowed,
    isError: isErrorFollowed,
    error: errorFollowed,
    refetch: refetchFollowed,
  } = useQuery({
    queryKey: ["topics-follows"],
    queryFn: GetFollowedTopics,
  });

  return (
    <div className="flex flex-col h-auto">
      <div className="p-4 w-full mx-auto flex md:flex-row flex-col gap-4 px-24">
        <div className="basis-4/6 pr-4">
          {/* Chủ đề của bạn */}
          <div className="bg-content1 rounded-md p-4 mb-5">
            <h2 className="text-base font-semibold">Chủ đề của bạn</h2>
            <div className="p-4">
              {isLoadingFollowed ? (
                <LoadingState message="Đang tải chủ đề..." />
              ) : isErrorFollowed ? (
                <ErrorState
                  message={errorFollowed?.message || "Không thể tải chủ đề"}
                  onRetry={refetchFollowed}
                />
              ) : followedTopics.length > 0 ? (
                <div className="mt-0 space-y-2">
                  {followedTopics.map((topic) => (
                    <FollowedTopicsItem
                      key={topic.id}
                      topic={topic}
                      showButton
                      className="justify-between"
                    />
                  ))}
                </div>
              ) : (
                <NoTopic onOpen={onOpen} />
              )}
            </div>
          </div>

          {/* Khám phá chủ đề */}
          <div className="mt-6" id="discover-topics">
            <h2 className="text-base font-semibold">Khám phá chủ đề</h2>
            <p className="mt-2 text-gray-400 mb-4 text-sm">
              Những chủ đề bạn có thể thích
            </p>

            {isLoading && currentPage === 1 ? (
              <LoadingState message="Đang tải chủ đề..." />
            ) : isError ? (
              <ErrorState
                message={(error as any)?.message || "Không thể tải chủ đề"}
                onRetry={refetch}
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={allTopics.length}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <InfiniteScroll
                    dataLength={allTopics.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<TagSkeleton count={6} />}
                  >
                    <CardList
                      items={allTopics}
                      renderItem={(topic: TopicResponse) => {
                        const { isFollowing, toggleFollow, isPending } =
                          useFollowTopic(topic.id);

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
                              onPress={toggleFollow}
                              isLoading={isPending}
                              className="text-xs font-semibold flex"
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
                  </InfiniteScroll>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="md:basis-2/6 md:pl-4 md:h-fit md:sticky md:top-18">
          <div className="bg-content1 rounded-md p-4 h-[200px]">
            <h3 className="font-semibold mb-4">Lời mời đang chờ</h3>
            <div className="text-center opacity-60">Chưa có lời mời nào</div>
          </div>
        </div>
      </div>

      <TopicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        followedTopics={allTopics}
      />
    </div>
  );
};

export default TopicsPage;
