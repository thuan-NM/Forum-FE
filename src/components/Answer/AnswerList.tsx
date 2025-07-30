"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence, motion } from "framer-motion";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { Skeleton } from "@heroui/react";

import { ListAnswers } from "../../services";
import AnswerItem from "./AnswerItem/AnswerItem";
import NotFind from "../Common/NotFind";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import { AnswerResponse } from "../../store/interfaces/answerInterfaces";

interface AnswerListProps {
  questionId: string;
}

const LIMIT = 12;

const AnswerList: React.FC<AnswerListProps> = ({ questionId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["answers", questionId],
    queryFn: ({ pageParam = 1 }) =>
      ListAnswers(questionId, LIMIT, Number(pageParam)),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.answers.length,
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const allAnswers =
    data?.pages?.flatMap((page) => page.answers as AnswerResponse[]) ?? [];

  if (isLoading) {
    return <LoadingState message="Đang tải câu trả lời..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Không thể tải câu trả lời"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mt-3 space-y-4">
      {allAnswers.length === 0 ? (
        <NotFind
          className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
          title="answer"
          icon={
            <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
          }
        />
      ) : (
        <InfiniteScroll
          dataLength={allAnswers.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          loader={
            isFetchingNextPage ? (
              <Skeleton className="w-full h-20 rounded-lg" />
            ) : null
          }
        >
          <AnimatePresence>
            {allAnswers.map((answer) => (
              <motion.div
                key={answer.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <AnswerItem answer={answer} />
              </motion.div>
            ))}
          </AnimatePresence>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default AnswerList;
