"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence } from "framer-motion";
import { FaRegLightbulb, FaChevronRight } from "react-icons/fa6";

import {
  GetAllQuestions,
  DeleteQuestion,
} from "../../services/QuestionServices";
import { QuestionResponse } from "../../store/interfaces/questionInterfaces";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import QuestionItem from "../Question/QuestionItem/QuestionItem";
import NotFind from "../Common/NotFind";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import { QuestionSkeleton } from "../Skeleton/QuestionSkeleton";

interface MyQuestionListProps {
  user: UserResponse;
}

const PAGE_SIZE = 12;

const MyQuestionList: React.FC<MyQuestionListProps> = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allQuestions, setAllQuestions] = useState<QuestionResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["questions", user.id, currentPage],
    queryFn: () =>
      GetAllQuestions({
        limit: PAGE_SIZE,
        page: currentPage,
        status: "approved",
        user_id: user?.id,
      }),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: (data) => {
      toast.success(data?.message || "Xóa câu hỏi thành công");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      // Reset state sau khi xóa để tránh hiển thị sai
      setAllQuestions([]);
      setCurrentPage(1);
      setHasMore(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể xóa câu hỏi");
    },
  });

  const handleDelete = (questionId: string) => {
    deleteMutation.mutate(questionId);
  };

  useEffect(() => {
    if (data?.questions) {
      setAllQuestions((prev) => [...prev, ...data.questions]);
      if (allQuestions.length + data.questions.length >= data.total) {
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
    return (
      <div className="my-3 text-center">
        <QuestionSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={(error as any)?.message || "Không thể tải câu hỏi"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="bg-content1 mt-3 !rounded-lg my-3 relative">
      <Button
        onPress={() => navigate("/answer")}
        variant="ghost"
        className="!border-0 rounded-b-none flex items-center justify-between w-full !rounded-t-lg hover:bg-content3 transition duration-200 ease-in-out p-3 py-2"
      >
        <div className="flex items-center gap-x-2">
          <div className="bg-red-500 w-6 h-6 flex items-center justify-center rounded-md text-white">
            <FaRegLightbulb className="text-base" />
          </div>
          <span className="text-xs">Questions for you</span>
        </div>
        <FaChevronRight />
      </Button>

      <AnimatePresence mode="wait">
        {allQuestions.length > 0 ? (
          <InfiniteScroll
            dataLength={allQuestions.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<LoadingState message="Đang tải thêm câu hỏi..." />}
          >
            <div className="space-y-4">
              {allQuestions.map((question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <NotFind
            title="questions"
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6"
            icon={<FaRegLightbulb className="size-10 !text-foreground/20" />}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyQuestionList;
