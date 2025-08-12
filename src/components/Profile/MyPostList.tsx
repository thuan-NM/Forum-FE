"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence } from "framer-motion";
import { BsFileEarmarkPostFill } from "react-icons/bs";

import { GetAllPosts } from "../../services";
import { useDeletePost } from "../../hooks/posts/useDeletePost";
import PostItem from "../PostManage/Post/PostItem/PostItem";
import NotFind from "../Common/NotFind";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";

import { PostResponse } from "../../store/interfaces/postInterfaces";
import { UserResponse } from "../../store/interfaces/userInterfaces";

interface MyPostListProps {
  user: UserResponse;
}

const PAGE_SIZE = 12;

const MyPostList: React.FC<MyPostListProps> = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<PostResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["posts", user.id, currentPage],
    queryFn: () =>
      GetAllPosts({
        limit: PAGE_SIZE,
        page: currentPage,
        user_id: user?.id,
        status: "approved",
      }),
  });

  const { DeletePost } = useDeletePost();

  useEffect(() => {
    if (data?.posts) {
      setAllPosts((prev) => [...prev, ...data.posts]);
      if (allPosts.length + data.posts.length >= data.total) {
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
    return <LoadingState message="Đang tải bài viết..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={(error as any)?.message || "Không thể tải bài viết"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mt-3">
      <AnimatePresence mode="wait">
        {allPosts.length > 0 ? (
          <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<LoadingState message="Đang tải thêm bài viết..." />}
          >
            <div className="space-y-4">
              {allPosts.map((post) => (
                <PostItem key={post.id} post={post} onDelete={DeletePost} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <NotFind
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
            title="Người dùng chưa đăng bất cứ bài viết nào"
            icon={
              <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPostList;
