import { AnimatePresence } from "framer-motion";
import { FaRegLightbulb, FaChevronRight } from "react-icons/fa6";
import QuestionItem from "./QuestionItem/QuestionItem";
import { QuestionResponse } from "../../store/interfaces/questionInterfaces";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  DeleteQuestion,
  GetAllQuestions,
} from "../../services/QuestionServices";
import { QuestionSkeleton } from "../Skeleton/QuestionSkeleton";
import toast from "react-hot-toast";
import NotFind from "../Common/NotFind";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const QuestionList = () => {
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
    queryKey: ["questions"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await GetAllQuestions({ page: pageParam, limit: 12 });
        console.log(`Page ${pageParam} result:`, result);

        // Đảm bảo result có đúng structure
        if (!result || typeof result !== "object") {
          throw new Error("Invalid API response structure");
        }

        // Đảm bảo questions là array và total là number
        const normalizedResult = {
          questions: Array.isArray(result.questions) ? result.questions : [],
          total: typeof result.total === "number" ? result.total : 0,
          page: pageParam,
        };

        console.log(`Normalized page ${pageParam}:`, normalizedResult);
        return normalizedResult;
      } catch (error) {
        console.error(`Error fetching page ${pageParam}:`, error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      try {
        console.log("getNextPageParam called");
        console.log("lastPage:", lastPage);
        console.log("allPages length:", allPages?.length);

        // Kiểm tra cơ bản
        if (!lastPage || !allPages || !Array.isArray(allPages)) {
          console.log("Invalid parameters for getNextPageParam");
          return undefined;
        }

        // Đảm bảo lastPage có structure đúng
        if (
          typeof lastPage.total !== "number" ||
          !Array.isArray(lastPage.questions)
        ) {
          console.log("Invalid lastPage structure:", lastPage);
          return undefined;
        }

        // Tính tổng số questions đã fetch
        const totalFetched = allPages.reduce((sum, page) => {
          if (page && Array.isArray(page.questions)) {
            return sum + page.questions.length;
          }
          return sum;
        }, 0);

        console.log(
          `Total fetched: ${totalFetched}, Total available: ${lastPage.total}`
        );

        // Kiểm tra xem còn data để fetch không
        const hasMore = totalFetched < lastPage.total;
        const nextPage = hasMore ? allPages.length + 1 : undefined;

        console.log(`Has more: ${hasMore}, Next page: ${nextPage}`);
        return nextPage;
      } catch (error) {
        console.error("Error in getNextPageParam:", error);
        return undefined;
      }
    },
    initialPageParam: 1,
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount}:`, error);
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    // Đảm bảo query được enable
    enabled: true,
    // Thêm option này để tránh lỗi khi mount
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: (data) => {
      toast.success(data?.message || "Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete question"
      );
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Triggering fetchNextPage");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Xử lý questions từ infinite query
  const questions: QuestionResponse[] = (() => {
    try {
      if (!data?.pages) {
        console.log("No pages data available");
        return [];
      }

      const allQuestions = data.pages
        .filter((page) => page && Array.isArray(page.questions))
        .flatMap((page) => page.questions)
        .filter((question): question is QuestionResponse => {
          return question && typeof question === "object" && !!question.id;
        });

      console.log(`Total questions processed: ${allQuestions.length}`);
      return allQuestions;
    } catch (error) {
      console.error("Error processing questions:", error);
      return [];
    }
  })();

  console.log("Component render state:", {
    isLoading,
    isError,
    hasData: !!data,
    pagesCount: data?.pages?.length,
    questionsCount: questions.length,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div className="my-3 text-center">
        <QuestionSkeleton />
      </div>
    );
  }

  if (isError) {
    console.error("Component error state:", error);
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
        <Button
          onPress={() => {
            console.log("Invalidating queries for retry");
            queryClient.invalidateQueries({ queryKey: ["questions"] });
          }}
          variant="bordered"
          className="mt-2"
        >
          Retry
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
      <AnimatePresence>
        {questions && questions.length > 0 ? (
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
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6"
            icon={<FaRegLightbulb className="size-10 !text-foreground/20" />}
          />
        )}
        {hasNextPage && (
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage ? (
              <QuestionSkeleton />
            ) : (
              <p className="text-foreground/50">Scroll to load more</p>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionList;
