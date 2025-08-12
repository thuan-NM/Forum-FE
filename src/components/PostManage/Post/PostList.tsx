"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { GetAllPosts } from "../../../services/PostServices";
import { Skeleton } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import PostItem from "./PostItem/PostItem";
import { useDeletePost } from "../../../hooks/posts/useDeletePost";
import { PostResponse } from "../../../store/interfaces/postInterfaces";
import NotFind from "../../Common/NotFind";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { useRef, useEffect } from "react";

const LIMIT = 10;

const PostList: React.FC = () => {
  const { DeletePost } = useDeletePost();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    // 👇 FIX kiểu dữ liệu
    { posts: PostResponse[]; total: number },
    Error
  >({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      GetAllPosts({ limit: LIMIT, page: pageParam }),
    initialPageParam: 1, // 👈 FIX thiếu cái này
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.posts).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="my-3 text-center">
        <Skeleton className="w-full h-32 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error?.message || "Đã có lỗi xảy ra"}</p>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="mt-3 space-y-3">
      <AnimatePresence>
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
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
          ))
        ) : (
          <NotFind
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
            title="post"
            icon={
              <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
            }
          />
        )}
      </AnimatePresence>

      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && <Skeleton className="w-full h-20 rounded-lg" />}
      </div>
    </div>
  );
};

export default PostList;
