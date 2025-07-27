"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence, motion } from "framer-motion";
import { BsFileEarmarkPostFill } from "react-icons/bs";

import { GetAllAnswers } from "../../services";
import AnswerItem from "../Answer/AnswerItem/AnswerItem";
import LoadingState from "../Common/LoadingState";
import NotFind from "../Common/NotFind";
import ErrorState from "../Common/ErrorState";
import { AnswerResponse } from "../../store/interfaces/answerInterfaces";
import { UserResponse } from "../../store/interfaces/userInterfaces";

interface MyAnswerListProps {
  user: UserResponse;
}

const PAGE_SIZE = 12;

const MyAnswerList: React.FC<MyAnswerListProps> = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allAnswers, setAllAnswers] = useState<AnswerResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["answers", user.id, currentPage],
    queryFn: () =>
      GetAllAnswers({
        limit: PAGE_SIZE,
        page: currentPage,
        user_id: user?.id,
      }),
  });

  useEffect(() => {
    if (data?.answers) {
      setAllAnswers((prev) => [...prev, ...data.answers]);
      if (allAnswers.length + data.answers.length >= data.total) {
        setHasMore(false);
      }
    }
  }, [data]);

  const fetchMoreData = () => {
    if (hasMore && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading && currentPage === 1) {
    return <LoadingState message="Đang tải câu trả lời..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={(error as any)?.message || "Không thể tải câu trả lời"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mt-3 space-y-4">
      <motion.div
        key={allAnswers.length}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <AnimatePresence mode="wait">
          {allAnswers.length > 0 ? (
            <InfiniteScroll
              dataLength={allAnswers.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<LoadingState message="Đang tải câu trả lời..." />}
            >
              <div className="space-y-4">
                {allAnswers.map((answer) => (
                  <AnswerItem key={answer.id} answer={answer} />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <NotFind
              className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
              title="Người dùng chưa trả lời câu hỏi nào"
              icon={
                <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
              }
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyAnswerList;
