// ✅ PostItem.tsx
import PostHeader from "./PostHeader";
import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import CommentList from "../Comment/CommentList";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentResponse } from "../../../../store/interfaces/commentInterfaces";
import { getAllComments, ListComments } from "../../../../services";
import NotFind from "../../../Common/NotFind";

interface PostItemProps {
  post: PostResponse;
  onDelete?: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete }) => {
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
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam = 1 }) =>
      ListComments({ page: pageParam, limit: 5, post_id: post.id }),
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
      <PostHeader post={post} onDelete={() => onDelete?.(post.id)} />
      <PostContent post={post} />
      <PostFooter
        setIsShowComment={setIsShowComment}
        isShowComment={isShowComment}
        totalComment={data?.pages?.[0]?.total ?? 0}
      />

      <AnimatePresence>
        {isShowComment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CommentList
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

export default PostItem;
