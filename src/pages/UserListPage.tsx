"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

import { GetAllTags, GetAllUsers } from "../services";

import CardList from "../components/Common/Card/CardList";
import CardItem from "../components/Common/Card/CardItem";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import TagSkeleton from "../components/Skeleton/TagSkeleton";
import { TagResponse } from "../store/interfaces/tagInterfaces";
import TopicTab from "../components/Topic/TopicTab";
import { UserResponse } from "../store/interfaces/userInterfaces";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFollowItem } from "../hooks/follows/useFollowItem";
import { useFollowUser } from "../hooks/follows/useFollowUser";

const PAGE_SIZE = 12;

const UsersPage = () => {
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
    queryKey: ["users"],
    queryFn: ({ pageParam = 1 }) =>
      GetAllUsers({ limit: PAGE_SIZE, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(allPages)) return undefined;

      const totalFetched = allPages.reduce((sum, page) => {
        if (!page || !Array.isArray(page.users)) return sum;
        return sum + page.users.length;
      }, 0);

      const totalAvailable =
        typeof lastPage.total === "number" ? lastPage.total : 0;

      return totalFetched < totalAvailable ? allPages.length + 1 : undefined;
    },

    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users: UserResponse[] = data?.pages.flatMap((page) => page.users) || [];

  return (
    <div className="flex flex-col h-auto">
      <div className="p-4 w-full mx-auto flex md:flex-row flex-col gap-4 px-24">
        <div className="basis-4/6 pr-4">
          {/* Chủ đề của bạn */}

          {/* Khám phá chủ đề */}
          <div className="mt-6" id="discover-topics">
            <h2 className="text-base font-semibold">
              Khám phá các người dùng{" "}
            </h2>
            <p className="mt-2 text-gray-400 mb-4 text-sm">
              Những người bạn có thể quan tâm
            </p>

            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState
                message={(error as any)?.message || "Không thể tải người dùng"}
                onRetry={refetch}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={users.length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CardList
                      items={users}
                      renderItem={(user: UserResponse) => {
                        const { isFollowing, toggleFollow, isPending } =
                          useFollowUser(user.id);

                        return (
                          <CardItem
                            key={user.id}
                            id={user.id}
                            name={user.fullName}
                            avatarUrl={user.avatar || ""}
                            description={user.username || ""}
                            type="users"
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
                                · {user.followersCount}
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
        <div className="md:basis-2/6 md:pl-4">
          <TopicTab />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
