"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsFileEarmarkPostFill } from "react-icons/bs";

import { ListAnswers } from "../../services";
import AnswerItem from "./AnswerItem/AnswerItem";
import NotFind from "../Common/NotFind";
import LoadingState from "../Common/LoadingState";
import { Skeleton } from "@heroui/react";
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
  } = useInfiniteQuery<{
    answers: AnswerResponse[];
    total: number;
  }>({
    queryKey: ["answers", questionId],
    queryFn: ({ pageParam = 1 }) =>
      ListAnswers(questionId, LIMIT, Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.answers).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingState message="Đang tải câu trả lời..." />;
  }

  if (isError) {
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">
          {error?.message || "Lỗi khi tải dữ liệu"}
        </p>
      </div>
    );
  }

  const allAnswers =
    data?.pages.flatMap((page) => page.answers as AnswerResponse[]) ?? [];

  return (
    <div className="mt-3 space-y-4">
      <AnimatePresence>
        {allAnswers.length > 0 ? (
          allAnswers.map((answer) => (
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
          ))
        ) : (
          <NotFind
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
            title="answer"
            icon={
              <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
            }
          />
        )}
      </AnimatePresence>

      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && <Skeleton className="w-full h-20 rounded-lg" />}
      </div>
    </div>
  );
};

export default AnswerList;
