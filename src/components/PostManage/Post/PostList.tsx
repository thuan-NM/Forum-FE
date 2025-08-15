"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence, motion } from "framer-motion";
import { BsFileEarmarkPostFill } from "react-icons/bs";

import { GetAllPosts } from "../../../services/PostServices";
import { useDeletePost } from "../../../hooks/posts/useDeletePost";
import { PostResponse } from "../../../store/interfaces/postInterfaces";

import PostItem from "./PostItem/PostItem";
import { Skeleton } from "@heroui/react";
import NotFind from "../../Common/NotFind";
import ErrorState from "../../Common/ErrorState";
import { useAppSelector } from "../../../store/hooks";

const LIMIT = 10;

const PostList: React.FC = () => {
  const { DeletePost } = useDeletePost();
  const filter = useAppSelector((state) => state.filter);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", "list", filter],
    queryFn: ({ pageParam = 1 }) =>
      GetAllPosts({
        limit: LIMIT,
        page: pageParam,
        status: "approved",
        search: filter.search || undefined,
        sort: filter.sort || undefined,
        tagfilter:
          Array.isArray(filter.tag) && filter.tag.length > 0
            ? filter.tag.map((id) => Number(id)).join(",")
            : undefined,
      }),

    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.posts.length,
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });

  const allPosts =
    data?.pages?.flatMap(
      (page: { posts: PostResponse[] }) => page.posts ?? []
    ) ?? [];

  if (isLoading) {
    return (
      <div className="my-3 text-center">
        <Skeleton className="w-full h-32 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Không thể tải bài viết"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {allPosts.length === 0 ? (
        <NotFind
          className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
          title="Không có bài viết nào"
          icon={
            <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
          }
        />
      ) : (
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          loader={
            isFetchingNextPage ? (
              <Skeleton className="w-full h-20 rounded-lg" />
            ) : null
          }
        >
          <AnimatePresence>
            {allPosts.map((post: PostResponse) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <PostItem post={post} onDelete={DeletePost} />
              </motion.div>
            ))}
          </AnimatePresence>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default PostList;
