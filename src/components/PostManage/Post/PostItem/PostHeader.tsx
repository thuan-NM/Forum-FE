import { Avatar, Button, Link } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../../../store/interfaces/userInterfaces";
import { GetUserById } from "../../../../services/UserServices";
import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import { GoDotFill } from "react-icons/go";
import { format } from "timeago.js"; // Import timeago.js
import { PostHeaderSkeleton } from "../../../Skeleton/PostSkeleton";
import { MdClear } from "react-icons/md";

interface PostHeaderProps {
  post: PostResponse;
  onDelete?: () => void; // Thêm prop để gọi hàm xóa từ parent
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDelete }) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: ["users", post.author.id],
    queryFn: () => GetUserById(post.author.id),
  });
  const date = new Date(post?.createdAt).getTime();

  if (isLoading) {
    return <PostHeaderSkeleton />;
  }

  if (isError) {
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between mb-2">
      <div className="flex items-center gap-x-2">
        <Avatar
          size="sm"
          radius="full"
          className="w-6 h-6 sm:w-8 sm:h-8"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <div className="flex flex-col !text-xs md:text-sm gap-y-1">
          <div className="font-bold flex flex-wrap items-center gap-x-1">
            <div>{user?.username}</div>
            <GoDotFill className="w-2 h-2 hidden sm:block" />
            <Link href="" underline="hover" size="sm" className="text-xs">
              Follow
            </Link>
          </div>
          <div className="opacity-90 text-xs flex flex-wrap !items-center gap-x-1">
            <div className="hidden sm:block">{user?.email}</div>
            <GoDotFill className="w-2 h-2" />
            <div>{format(date)}</div>
          </div>
        </div>
      </div>
      <Button
        isIconOnly
        className="border-none cursor-pointer w-fit bg-transparent hover:bg-content3 rounded-full"
        size="sm"
        onPress={onDelete} // Gọi hàm onDelete từ props
      >
        <MdClear className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default PostHeader;
