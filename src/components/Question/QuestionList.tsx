import { AnimatePresence, motion } from "framer-motion";
import { FaRegLightbulb, FaChevronRight } from "react-icons/fa6";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  GetAllQuestions,
  DeleteQuestion,
} from "../../services/QuestionServices";
import QuestionItem from "./QuestionItem/QuestionItem";
import { QuestionSkeleton } from "../Skeleton/QuestionSkeleton";
import NotFind from "../Common/NotFind";
import { Button } from "@heroui/react";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";

const PAGE_SIZE = 12;

const QuestionList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const filter = useAppSelector((state: RootState) => state.filter);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["questions", filter],
    queryFn: ({ pageParam = 1 }) =>
      GetAllQuestions({
        page: pageParam,
        limit: PAGE_SIZE,
        status: "approved",
        search: filter.search || undefined,
        sort: filter.sort || undefined,
        topic_id:
          Array.isArray(filter.topic) && filter.topic.length > 0
            ? filter.topic.map((id) => Number(id)).join(",")
            : undefined,
      }),
    initialPageParam: 1, // 👈 Thêm dòng này
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((p) => p.questions).length;
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const allQuestions = data?.pages.flatMap((page) => page.questions) || [];

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: (data) => {
      toast.success(data?.message || "Xóa câu hỏi thành công");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa thất bại");
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  if (isLoading) {
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
          <span className="text-xs">Questions for you</span>
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
          {Array.isArray(allQuestions) && allQuestions.length > 0 ? (
            <InfiniteScroll
              dataLength={allQuestions.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={<QuestionSkeleton />}
            >
              {allQuestions
                .filter(
                  (q): q is NonNullable<typeof q> =>
                    q !== null && q !== undefined
                ) // ✅ bỏ null
                .map((question) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending}
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
