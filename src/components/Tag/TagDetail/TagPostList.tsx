import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import LoadingState from "../../Common/LoadingState";
import NotFind from "../../Common/NotFind";
import { GetAllPosts } from "../../../services";
import { TagResponse } from "../../../store/interfaces/tagInterfaces";
import PostItem from "../../PostManage/Post/PostItem/PostItem";
import { PostResponse } from "../../../store/interfaces/postInterfaces";
interface TagAnswerListProps {
  tag: TagResponse;
}
const TagPostList: React.FC<TagAnswerListProps> = ({ tag }) => {
  const { data, isLoading, isError, error } = useQuery<{
    posts: PostResponse[];
    total: number;
  }>({
    queryKey: ["posts"],
    queryFn: () => GetAllPosts({ tagfilter: tag.id }),
  });

  if (isLoading) return <LoadingState message="Đang tải câu trả lời..." />;

  if (isError)
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">
          {error?.message || "Lỗi khi tải dữ liệu"}
        </p>
      </div>
    );

  return (
    <div className="mt-3 space-y-4">
      <AnimatePresence>
        {data?.posts && data?.posts?.length > 0 ? (
          data.posts.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <NotFind
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
            title="answer"
            icon={
              <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagPostList;
