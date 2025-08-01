"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [allTags, setAllTags] = useState<TagResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tags", currentPage],
    queryFn: async () =>
      await GetAllTags({ limit: PAGE_SIZE, page: currentPage }),
  });

  useEffect(() => {
    if (data?.tags) {
      setAllTags((prev) => [...prev, ...data.tags]);
      if (allTags.length + data.tags.length >= data.total) {
        setHasMore(false);
      }
    }
  }, [data]);

  const fetchMoreData = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading && currentPage === 1) {
    return <LoadingState message="Đang tải nhãn..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={(error as any)?.message || "Không thể tải nhãn"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col h-auto ">
      <div className="p-4 w-full mx-auto flex md:flex-row flex-col gap-4 px-24">
        <div className="md:basis-4/6 md:pr-4 mx-auto">
          {/* Khám phá nhãn */}
          <div className="mt-6" id="discover-tags animated-fade">
            <motion.div
              key={allTags.length}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-base font-semibold">Khám phá Nhãn</h2>
              <p className="mt-2 text-gray-400 mb-4 text-sm">
                Những nhãn bạn có thể quan tâm
              </p>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={allTags.length}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <InfiniteScroll
                  dataLength={allTags.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<TagSkeleton count={6} />}
                >
                  <CardList
                    items={allTags}
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
                </InfiniteScroll>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="flex md:basis-2/6 md:pl-4 md:h-fit md:sticky md:top-20 w-full mx-auto">
          <TopicTab className="ml-0" />
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
