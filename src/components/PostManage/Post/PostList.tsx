import { useQuery } from "@tanstack/react-query";
import { GetAllPosts } from "../../../services/PostServices";
import { Skeleton } from "@heroui/react";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence
import PostItem from "./PostItem/PostItem";
import { useDeletePost } from "../../../hooks/posts/useDeletePost";
import { PostResponse } from "../../../store/interfaces/postInterfaces";
import NotFind from "../../Common/NotFind";
import { BsFileEarmarkPostFill } from "react-icons/bs";

const PostList: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<{
    posts: PostResponse[];
    total: number;
  }>({
    queryKey: ["posts"],
    queryFn: () => GetAllPosts({ limit: 10 }),
  });

  const { DeletePost } = useDeletePost();

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
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <AnimatePresence>
        {data?.posts && data.posts.length > 0 ? (
          data.posts.map((post) => (
            <PostItem key={post.id} post={post} onDelete={DeletePost} />
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
    </div>
  );
};

export default PostList;
