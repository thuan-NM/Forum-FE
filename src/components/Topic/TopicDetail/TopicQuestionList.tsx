import { AnimatePresence } from "framer-motion";
import { FaRegLightbulb, FaChevronRight } from "react-icons/fa6";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { QuestionResponse } from "../../../store/interfaces/questionInterfaces";
import { DeleteQuestion, GetAllQuestions } from "../../../services";
import { QuestionSkeleton } from "../../Skeleton/QuestionSkeleton";
import QuestionItem from "../../Question/QuestionItem/QuestionItem";
import NotFind from "../../Common/NotFind";
import { TopicResponse } from "../../../store/interfaces/topicInterfaces";

interface TopicQuestionListProps {
  topic: TopicResponse;
}

const TopicQuestionList: React.FC<TopicQuestionListProps> = ({ topic }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["questions", topic?.id],
    queryFn: ({ pageParam = 1 }) =>
      GetAllQuestions({ topic_id: topic?.id, page: pageParam, limit: 2 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + (page.questions?.length || 0),
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!topic?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: (data) => {
      toast.success(data?.message || "Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["questions", topic.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa thất bại");
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const questions: QuestionResponse[] =
    data?.pages
      .flatMap((page) => page?.questions || [])
      .filter((q): q is QuestionResponse => !!q) || [];

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
          {(error as any)?.message || "An error occurred"}
        </p>
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

      <div>
        <AnimatePresence>
          {questions.length > 0 ? (
            questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <NotFind
              title="questions"
              className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 animate-fade"
              icon={<FaRegLightbulb className="size-10 !text-foreground/20" />}
            />
          )}
        </AnimatePresence>
        {hasNextPage && (
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage ? (
              <QuestionSkeleton />
            ) : (
              <p className="text-foreground/50">Scroll to load more</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicQuestionList;
