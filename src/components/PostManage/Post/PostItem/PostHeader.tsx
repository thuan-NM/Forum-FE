import { Avatar, Button, Link } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { GoDotFill } from "react-icons/go";
import { MdClear } from "react-icons/md";
import { format } from "timeago.js";

import { useState } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { RootState } from "../../../../store/store";

import { User } from "../../../../store/interfaces/userInterfaces";
import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import { GetUserById } from "../../../../services/UserServices";
import { useFollowItem } from "../../../../hooks/follows/useFollowItem";
import { PostHeaderSkeleton } from "../../../Skeleton/PostSkeleton";
import { useDeletePost } from "../../../../hooks/posts/useDeletePost";
import AlertAction from "../../../Common/AlertAction";

interface PostHeaderProps {
  post: PostResponse;
  onDeleted?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDeleted }) => {
  const userData = useAppSelector((state: RootState) => state.user.user);
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: ["users", post.author.id],
    queryFn: () => GetUserById(post.author.id),
  });

  const { isFollowing, handleToggleFollow, isCheckingFollow, isPending } =
    useFollowItem<{ id: string }>(post.author.id.toString(), "users");

  const { DeletePost, isDeleting } = useDeletePost();

  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = () => {
    DeletePost(post.id);
    setOpenAlert(false);
    onDeleted?.(); // optional callback
  };

  if (isLoading || isCheckingFollow) return <PostHeaderSkeleton />;
  if (isError)
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error.message}</p>
      </div>
    );

  const date = new Date(post?.createdAt).getTime();

  return (
    <>
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
              <div className="cursor-pointer hover:underline">{user?.username}</div>

              {post.author.id !== userData?.id && (
                <>
                  <GoDotFill className="w-2 h-2 hidden sm:block" />
                  <Link
                    underline="hover"
                    size="sm"
                    className="text-xs cursor-pointer"
                    onPress={handleToggleFollow}
                    isDisabled={isPending}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Link>
                </>
              )}
            </div>
            <div className="opacity-90 text-xs flex flex-wrap !items-center gap-x-1">
              <div className="hidden sm:block">{user?.email}</div>
              <GoDotFill className="w-2 h-2" />
              <div>{format(date)}</div>
            </div>
          </div>
        </div>

        {post.author.id === userData?.id && (
          <Button
            isIconOnly
            className="border-none cursor-pointer w-fit bg-transparent hover:bg-content3 rounded-full"
            size="sm"
            onPress={() => setOpenAlert(true)}
          >
            <MdClear className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Alert Modal dùng Iconify */}
      <AlertAction
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDelete}
        title="Xoá bài viết này?"
        description="Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá chứ?"
        iconName="ph:trash"
        confirmText="Xoá"
        cancelText="Huỷ"
        isDanger
        loading={isDeleting}
      />
    </>
  );
};

export default PostHeader;
