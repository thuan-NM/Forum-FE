"use client";

import { useEffect, useState } from "react";
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<
  { tags: TagResponse[]; total: number }, // 👈 kiểu dữ liệu trả về
  Error
>({
  queryKey: ["tags"],
  queryFn: async ({ pageParam = 1 }) => {
    return await GetAllTags({ limit: PAGE_SIZE, page: pageParam }); // 👈 phải `return`
  },
  getNextPageParam: (lastPage, allPages) => {
    const totalFetched = allPages.reduce(
      (sum, page) => sum + (page.tags?.length || 0),
      0
    );
    return totalFetched < lastPage.total ? allPages?.length + 1 : undefined;
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
      <div className="p-4 w-full mx-auto flex md:flex-row flex-col gap-4 px-24">
        <div className="md:basis-4/6 md:pr-4 mx-auto">
          {/* Khám phá nhãn */}
          <div className="mt-6" id="discover-tags">
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
                      renderItem={(tag: TagResponse) => (
                        <CardItem
                          key={tag.id}
                          id={tag.id}
                          name={tag.name}
                          description={tag.description || ""}
                          type="tags"
                        />
                      )}
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
        <div className="flex md:basis-2/6 md:pl-4 w-full mx-auto">
          <TopicTab className="ml-0" />
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
