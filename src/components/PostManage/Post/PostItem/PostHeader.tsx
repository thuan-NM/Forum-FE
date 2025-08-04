import { Avatar, Button, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { GoDotFill } from "react-icons/go";
import { MdClear } from "react-icons/md";
import { format } from "timeago.js";

import { useState } from "react";

import { User } from "../../../../store/interfaces/userInterfaces";
import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import { GetUserById } from "../../../../services/UserServices";
import { useFollowItem } from "../../../../hooks/follows/useFollowItem";
import { PostHeaderSkeleton } from "../../../Skeleton/PostSkeleton";
import { useDeletePost } from "../../../../hooks/posts/useDeletePost";
import AlertAction from "../../../Common/AlertAction";
import { cn } from "../../../../lib/utils";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { Modal } from "@heroui/react"; // Thêm import Modal
import PostEditModal from "../PostEdit/PostEditModal"; // Giả định path đến PostEditModal
import { useGetUserInfo } from "../../../../utils/getUserInfo";

interface PostHeaderProps {
  post: PostResponse;
  onDeleted?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDeleted }) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const userData = useGetUserInfo();

  const { isFollowing, handleToggleFollow, isCheckingFollow, isPending } =
    useFollowItem<{ id: string }>(post.author.id.toString(), "users");

  const { DeletePost, isDeleting } = useDeletePost();

  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = () => {
    DeletePost(post.id);
    setOpenAlert(false);
    onDeleted?.(); // optional callback
  };

  if (isCheckingFollow) return <PostHeaderSkeleton />;

  const date = new Date(post?.createdAt).getTime();

  return (
    <>
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-x-2">
          <Avatar
            size="sm"
            radius="full"
            className="w-6 h-6 sm:w-8 sm:h-8"
            src={
              post.author.avatar
                ? post.author.avatar
                : "https://i.pravatar.cc/150?u=a042581f4e29026704d"
            }
          />
          <div className="flex flex-col !text-xs md:text-sm gap-y-1">
            <div className="font-bold flex flex-wrap items-center gap-x-1">
              <Link
                to={`/users/${post?.author?.id}`}
                className="hover:underline cursor-pointer transition-all"
              >
                {post?.author?.fullName}
              </Link>

              {post.author.id !== userData?.id && (
                <>
                  <GoDotFill className="w-2 h-2 hidden sm:block" />
                  <div
                    className={cn(
                      "text-xs text-primary-500 hover:underline transition-all cursor-pointer",
                      isPending && "disabled"
                    )}
                    onClick={handleToggleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </div>
                </>
              )}
            </div>
            <div className="opacity-90 text-xs flex flex-wrap !items-center gap-x-1">
              <div className="hidden sm:block">{post?.author?.email}</div>
              <GoDotFill className="w-2 h-2" />
              <div>{format(date)}</div>
            </div>
          </div>
        </div>

        {post.author.id === userData?.id && (
          <div className="flex items-center gap-x-2">
            <Button
              color="default"
              radius="full"
              className="w-fit mx-auto font-semibold "
              size="sm"
              isIconOnly
              variant="light"
              onPress={() => onOpen()} // Mở modal edit
            >
              <CiEdit className="size-4" />
            </Button>
            <Button
              isIconOnly
              className="border-none cursor-pointer w-fit bg-transparent hover:bg-content3 rounded-full"
              size="sm"
              onPress={() => setOpenAlert(true)}
            >
              <MdClear className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Alert Modal */}
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

      {/* Modal Edit Post */}
      <Modal
        isOpen={isOpen}
        size={"3xl"}
        onOpenChange={onOpenChange}
        className="rounded-md z-20 max-h-[100vg] !my-0"
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled={false}
      >
        <PostEditModal post={post} />
      </Modal>
    </>
  );
};

export default PostHeader;
