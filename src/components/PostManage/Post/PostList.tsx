import { useQuery } from "@tanstack/react-query";
import { GetAllPosts } from "../../../services/PostServices";
import { Skeleton } from "@heroui/react";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence
import PostItem from "./PostItem/PostItem";
import { useDeletePost } from "../../../hooks/posts/useDeletePost";
import { PostResponse } from "../../../store/interfaces/postInterfaces";

const PostList: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<{
    posts: PostResponse[];
    total: number;
  }>({
    queryKey: ["posts"],
    queryFn: () => GetAllPosts({}),
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
        {data?.posts.map((post) => (
          <PostItem key={post.id} post={post} onDelete={DeletePost} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PostList;
