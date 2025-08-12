import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegLightbulb, FaChevronRight } from "react-icons/fa6";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  GetAllQuestions,
  DeleteQuestion,
} from "../../services/QuestionServices";
import { QuestionResponse } from "../../store/interfaces/questionInterfaces";
import QuestionItem from "./QuestionItem/QuestionItem";
import { QuestionSkeleton } from "../Skeleton/QuestionSkeleton";
import NotFind from "../Common/NotFind";
import { Button } from "@heroui/react";

const PAGE_SIZE = 12;

const QuestionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allQuestions, setAllQuestions] = useState<QuestionResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["questions", currentPage],
    queryFn: () => GetAllQuestions({ page: currentPage, limit: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.questions) {
      setAllQuestions((prev) => [...prev, ...data.questions]);

      const totalLoaded = allQuestions.length + data.questions.length;
      if (totalLoaded >= data.total) {
        setHasMore(false);
      }
    }
  }, [data]);

  const fetchMoreData = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: (data) => {
      toast.success(data?.message || "Xóa câu hỏi thành công");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setAllQuestions([]);
      setCurrentPage(1);
      setHasMore(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa thất bại");
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
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
      <div className="my-3 text-center">
        <p className="text-red-500">
          {(error as any)?.message || "Lỗi tải dữ liệu"}
        </p>
        <Button onPress={() => refetch()} variant="bordered" className="mt-2">
          Thử lại
        </Button>
      </div>
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
          <div className="bg-red-500 w-6 h-6 flex items-center justify-center rounded-md text-white !p-0">
            <FaRegLightbulb className="text-base !p-0" />
          </div>
          <span className="text-xs">Câu hỏi dành cho bạn</span>
        </div>
        <FaChevronRight />
      </Button>

      <AnimatePresence mode="wait">
        <motion.div
          key={allQuestions.length}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {allQuestions.length > 0 ? (
            <InfiniteScroll
              dataLength={allQuestions.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<QuestionSkeleton />}
            >
              {allQuestions.map((question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  onDelete={handleDelete}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <NotFind
              title="questions"
              className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6"
              icon={<FaRegLightbulb className="size-10 !text-foreground/20" />}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionList;
