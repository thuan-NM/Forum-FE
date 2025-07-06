import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import { ListAnswers } from "../../services";
import AnswerItem from "./AnswerItem/AnswerItem";
import NotFind from "../Common/NotFind";
import LoadingState from "../Common/LoadingState";
import { AnswerResponse } from "../../store/interfaces/answerInterfaces";

interface AnswerListProps {
  questionId: string;
}

const LIMIT = 10;

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
    queryFn: ({ pageParam }: { pageParam?: unknown }) =>
      ListAnswers(
        questionId,
        LIMIT,
        typeof pageParam === "number" ? pageParam : 1
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.answers).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const node = loadMoreRef.current;
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <LoadingState message="Đang tải câu trả lời..." />;

  if (isError)
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">
          {error?.message || "Lỗi khi tải dữ liệu"}
        </p>
      </div>
    );

  const allAnswers =
    data?.pages.flatMap((page) => page.answers as AnswerResponse[]) ?? [];

  return (
    <div className="mt-3 space-y-4">
      <AnimatePresence>
        {allAnswers.length > 0 ? (
          allAnswers.map((answer) => (
            <AnswerItem key={answer.id} answer={answer} />
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

      {hasNextPage && <LoadingState message="Đang tải câu trả lời..." />}
    </div>
  );
};

export default AnswerList;
