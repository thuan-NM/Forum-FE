import { Avatar, Button, Modal, useDisclosure } from "@heroui/react";
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
import { useGetUserInfo } from "../../../utils/getUserInfo";
import { CiEdit } from "react-icons/ci";
import AnswerEditModal from "../AnswerEdit/AnswerEditModal";
import { BsCheck2Circle } from "react-icons/bs";
import { useAcceptAnswer } from "../../../hooks/answers/useAcceptAnswer";
import StatusChip from "../../Common/StatusChip";

interface AnswerHeaderProps {
  answer: AnswerResponse;
}

const AnswerHeader: React.FC<AnswerHeaderProps> = ({ answer }) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const userData = useGetUserInfo();
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
  const { acceptAnswer, isAccepting } = useAcceptAnswer();
  const [openAcceptAlert, setOpenAcceptAlert] = useState(false);

  const { deleteAnswer, isDeleting } = useDeleteAnswer();

  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = () => {
    deleteAnswer(answer);
    setOpenAlert(false);
  };
  const handleAccept = () => {
    acceptAnswer(answer.id);
    setOpenAcceptAlert(false);
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
              {answer.isAccepted && (
                <>
                  <GoDotFill className="w-2 h-2 hidden sm:block" />
                  <StatusChip
                    status="Câu trả lời hữu ích"
                    color="success"
                    className="bg-green-400/20 text-green-800 dark:text-green-400 border-none"
                  />
                </>
              )}
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
                    {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
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
          <div className="flex items-center gap-x-2">
            {answer?.question?.author?.id === userData?.id &&
              !answer?.isAccepted && (
                <Button
                  color="default"
                  radius="full"
                  className="w-fit mx-auto font-semibold "
                  size="sm"
                  isIconOnly
                  variant="light"
                  onPress={() => setOpenAcceptAlert(true)} // Mở modal edit
                >
                  <BsCheck2Circle className="size-4" />
                </Button>
              )}
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
      {/* Alert Modal dùng Iconify */}
      <AlertAction
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDelete}
        title="Xoá câu trả lời này?"
        description="Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá chứ?"
        iconName="ph:trash"
        confirmText="Xoá"
        cancelText="Huỷ"
        isDanger
        loading={isDeleting}
      />
      <AlertAction
        open={openAcceptAlert}
        onClose={() => setOpenAcceptAlert(false)}
        onConfirm={handleAccept}
        title="Chấp nhận câu trả lời này?"
        description="Bạn sẽ đánh dấu đây là câu trả lời đúng nhất cho câu hỏi này. Hành động này có thể bị thay đổi sau."
        iconName="ph:check-circle"
        confirmText="Chấp nhận"
        cancelText="Huỷ"
        iconClassName="!text-green-400"
        isDanger={false}
        loading={isAccepting}
      />

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
        <AnswerEditModal answer={answer} />
      </Modal>
    </>
  );
};

export default AnswerHeader;
