"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

import { GetAllTags } from "../services";

import CardList from "../components/Common/Card/CardList";
import CardItem from "../components/Common/Card/CardItem";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import TagSkeleton from "../components/Skeleton/TagSkeleton";
import { TagResponse } from "../store/interfaces/tagInterfaces";
import TopicTab from "../components/Topic/TopicTab";

const PAGE_SIZE = 12;

const TagsPage = () => {
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
    queryKey: ["tags"],
    queryFn: ({ pageParam = 1 }) =>
      GetAllTags({ limit: PAGE_SIZE, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(allPages)) return undefined;

      const totalFetched = allPages.reduce((sum, page) => {
        if (!page || !Array.isArray(page.tags)) return sum;
        return sum + page.tags.length;
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

  const tags: TagResponse[] = data?.pages.flatMap((page) => page.tags) || [];

  return (
    <div className="flex flex-col h-auto">
      <div className="p-4 w-full max-w-screen-xl mx-auto flex">
        <div className="basis-4/6 pr-4">
          {/* Chủ đề của bạn */}

          {/* Khám phá chủ đề */}
          <div className="mt-6" id="discover-topics">
            <h2 className="text-base font-semibold">Khám phá Nhãn</h2>
            <p className="mt-2 text-gray-400 mb-4 text-sm">
              Những nhãn bạn có thể quan tâm
            </p>

            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState
                message={(error as any)?.message || "Không thể tải nhãn"}
                onRetry={refetch}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tags.length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CardList
                      items={tags}
                      renderItem={(tag: TagResponse) => {
                        return (
                          <CardItem
                            key={tag.id}
                            id={tag.id}
                            name={tag.name}
                            description={tag.description || ""}
                            type="tags"
                          ></CardItem>
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
          <TopicTab />
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
