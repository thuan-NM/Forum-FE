import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnswerResponse } from "../../../store/interfaces/answerInterfaces";
import { ListComments } from "../../../services";
import { CommentResponse } from "../../../store/interfaces/commentInterfaces";
import AnswerHeader from "./AnswerHeader";
import AnswerContent from "./AnswerContent";
import AnswerFooter from "./AnswerFooter";
import CommentList from "../../Comment/CommentList";

interface AnswerItemProps {
  answer: AnswerResponse;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer }) => {
  const [isShowComment, setIsShowComment] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<{ comments: CommentResponse[]; total: number }, Error>({
    queryKey: ["comments", answer.id],
    queryFn: ({ pageParam = 1 }) =>
      ListComments({
        page: pageParam,
        limit: 5,
        answer_id: answer.id,
        status: "approved",
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage.comments)) return undefined;
      const loaded = allPages.reduce(
        (sum, page) =>
          sum +
          (Array.isArray(page.comments)
            ? page.comments.filter(Boolean).length
            : 0),
        0
      );
      return loaded < (lastPage.total || 0) ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allComments =
    data?.pages?.flatMap((p) => p.comments).filter(Boolean) ?? [];

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-content1 rounded-lg my-3 relative"
    >
      <AnswerHeader answer={answer} />
      <AnswerContent answer={answer} />
      <AnswerFooter
        answer={answer}
        setIsShowComment={setIsShowComment}
        isShowComment={isShowComment}
        totalComment={data?.pages?.[0]?.total ?? 0}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isShowComment && (
          <motion.div
            key="comment-list"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommentList
              id={answer.id}
              type={"answer_id"}
              comments={allComments}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnswerItem;
