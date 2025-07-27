import { Avatar, Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { GoDotFill } from "react-icons/go";
import { MdClear } from "react-icons/md";
import { format } from "timeago.js";

import { useState } from "react";
import { AnswerResponse } from "../../../store/interfaces/answerInterfaces";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { useFollowItem } from "../../../hooks/follows/useFollowItem";
import { GetUserById } from "../../../services";
import { UserResponse } from "../../../store/interfaces/userInterfaces";
import { AnswerHeaderSkeleton } from "../../Skeleton/AnswerSkeleton";
import AlertAction from "../../Common/AlertAction";
import { useDeleteAnswer } from "../../../hooks/answers/useDeleteAnswer";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

interface AnswerHeaderProps {
  answer: AnswerResponse;
}

const AnswerHeader: React.FC<AnswerHeaderProps> = ({ answer }) => {
  const userData = useAppSelector((state: RootState) => state.user.user);
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserResponse>({
    queryKey: ["users", answer.author.id],
    queryFn: () => GetUserById(answer.author.id),
  });

  const { isFollowing, handleToggleFollow, isCheckingFollow, isPending } =
    useFollowItem<{ id: string }>(answer.author.id.toString(), "users");

  const { deleteAnswer, isDeleting } = useDeleteAnswer();

  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = () => {
    deleteAnswer(answer);
    setOpenAlert(false);
  };

  if (isLoading || isCheckingFollow) return <AnswerHeaderSkeleton />;
  if (isError)
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error.message}</p>
      </div>
    );

  const date = new Date(answer?.createdAt).getTime();

  return (
    <>
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-x-2">
          <Avatar
            size="sm"
            radius="full"
            className="w-6 h-6 sm:w-8 sm:h-8"
            src={
              user?.avatar
                ? user.avatar
                : "https://i.pravatar.cc/150?u=a042581f4e29026704d"
            }
          />
          <div className="flex flex-col !text-xs md:text-sm gap-y-1">
            <div className="font-bold flex flex-wrap items-center gap-x-1">
              <Link
                to={`/users/${answer?.author?.id}`}
                className="hover:underline cursor-pointer transition-all"
              >
                {answer?.author?.fullName}
              </Link>
              <GoDotFill className="w-2 h-2 hidden sm:block" />
              {answer.author.id !== userData?.id && (
                <>
                  <GoDotFill className="w-2 h-2 hidden sm:block" />
                  <div
                    className={cn(
                      "text-xs text-primary-500 hover:underline transition-all cursor-pointer",
                      isPending && "disabled"
                    )}
                    onClick={handleToggleFollow}
                    // disabled={isPending}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </div>
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

        {answer.author.id === userData?.id && (
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

export default AnswerHeader;
