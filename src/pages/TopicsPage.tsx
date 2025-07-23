"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDisclosure, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { GetAllTopics, GetFollowedTopics } from "../services";
import { TopicResponse } from "../store/interfaces/topicInterfaces";
import { useFollowItem } from "../hooks/follows/useFollowItem";

import CardList from "../components/Common/Card/CardList";
import CardItem from "../components/Common/Card/CardItem";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import TopicModal from "../components/Topic/TopicModal";
import NoTopic from "../components/Topic/NoTopic";
import TagSkeleton from "../components/Skeleton/TagSkeleton";
import FollowedTopicsItem from "../components/Topic/FollowedTopicItem";
import { useFollowTopic } from "../hooks/follows/useFollowTopic";

const PAGE_SIZE = 12;

const TopicsPage = () => {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const { ref, inView } = useInView();

  // Infinite scroll cho topics
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["topics"],
    queryFn: ({ pageParam = 1 }) =>
      GetAllTopics({ limit: PAGE_SIZE, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + (page.topics?.length || 0),
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Chủ đề đang theo dõi
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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const topics: TopicResponse[] =
    data?.pages.flatMap((page) => page.topics) || [];

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

            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState
                message={(error as any)?.message || "Không thể tải chủ đề"}
                onRetry={refetch}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={topics.length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex"
                  >
                    <CardList
                      items={topics}
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
                  </motion.div>
                </AnimatePresence>

                {hasNextPage && (
                  <div ref={ref} className="py-6 text-center">
                    {isFetchingNextPage ? (
                      <TagSkeleton count={6} />
                    ) : (
                      <p className="text-gray-400">Cuộn để tải thêm...</p>
                    )}
                  </div>
                )}
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

      <TopicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        followedTopics={topics}
      />
    </div>
  );
};

export default TopicsPage;
