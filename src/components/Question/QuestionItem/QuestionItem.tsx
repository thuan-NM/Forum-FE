import React, { useState } from "react";
import { QuestionResponse } from "../../../store/interfaces/questionInterfaces";
import { Button } from "@heroui/react";
import { MdClear, MdOutlineEditOff } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { BiEdit } from "react-icons/bi";
import { FaLink, FaRss } from "react-icons/fa6";
import { GrUnorderedList } from "react-icons/gr";
import { PiWarningBold } from "react-icons/pi";
import { IoPersonAddSharp } from "react-icons/io5";
import { PiClockCountdownFill } from "react-icons/pi";
import { HiOutlineBell } from "react-icons/hi";
import { useDisclosure } from "@heroui/react";
import AnswerModal from "../../Answer/AnswerModal";
import { motion } from "framer-motion";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";

// ✅ Custom hooks
import { usePassQuestion } from "../../../hooks/questions/usePassQuestion";
import { useFollowItem } from "../../../hooks/follows/useFollowItem";
import MoreActionsPopover from "../../Common/MoreActionsPopover";
import ReportModal from "../../Report/ReportModal";
import { IoIosSwitch } from "react-icons/io";
import { useGetUserInfo } from "../../../utils/getUserInfo";
import QuestionStatusModal from "../QuestionEdit/QuestionStatusModal";
import { CiEdit } from "react-icons/ci";
import AlertAction from "../../Common/AlertAction";
import toast from "react-hot-toast";

interface QuestionItemProps {
  question: QuestionResponse;
  onDelete: (questionId: string) => void;
  isDeleting?: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onDelete,
  isDeleting,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const userData = useGetUserInfo();
  const { passQuestion, isPassing } = usePassQuestion();
  const navigate = useNavigate();
  const {
    isOpen: isStatusOpen,
    onOpenChange: onStatusOpenChange,
    onOpen: onOpenStatusModal,
  } = useDisclosure();
  const {
    isFollowing,
    isCheckingFollow,
    handleToggleFollow,
    isPending: isFollowPending,
  } = useFollowItem<QuestionResponse>(question.id, "questions");

  const date = question.lastFollowed
    ? new Date(question.lastFollowed).getTime()
    : null;

  const handleDelete = () => {
    onDelete(question?.id || "");
    setOpenAlert(false);
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-t border-content3 p-4 relative">
        <div className="flex items-center justify-between">
          <Link
            to={`/question/${question.id}`}
            className="text-md font-bold hover:underline"
          >
            {question.title}
          </Link>
          {question && question?.author?.id === userData?.id && (
            <div className="flex items-center gap-x-2">
              <Button
                color="default"
                radius="full"
                className="w-fit mx-auto font-semibold"
                size="sm"
                onPress={onOpenStatusModal}
                isIconOnly
                variant="light"
              >
                <IoIosSwitch className="size-4" />
              </Button>
              <Button
                color="default"
                radius="full"
                className="w-fit mx-auto font-semibold"
                size="sm"
                isIconOnly
                onPress={() => navigate(`/question/${question.id}`)}
                variant="light"
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
        <div className="flex gap-x-1 opacity-80 text-xs flex-wrap !items-center mt-1">
          <Link
            to={`/question/${question.id}`}
            className="font-bold hover:underline"
          >
            {question.answersCount} câu trả lời
          </Link>
          <GoDotFill className="w-1 h-1 hidden sm:block" />
          <span>
            {date ? `Last followed ${format(date)}` : `Chưa được theo dõi`}
          </span>
          <GoDotFill className="w-1 h-1 hidden sm:block" />
          <span>{question.author.fullName}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-x-1">
            <Button
              size="sm"
              variant="bordered"
              radius="full"
              className="gap-x-[4px] !font-semibold"
              onPress={onOpen}
            >
              <BiEdit className="w-5 h-5" /> Trả lời
            </Button>
            <Button
              size="sm"
              variant={isFollowing ? "bordered" : "light"}
              radius="full"
              className={`gap-x-[4px] !font-semibold transition-all duration-200 ${isFollowing ? "shadow-md bg-content1" : ""}`}
              onPress={handleToggleFollow}
              isLoading={isFollowPending || isCheckingFollow}
            >
              <FaRss className="w-4 h-4" />
              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              <GoDotFill className="w-1 h-1 hidden sm:block" />
              {question.followsCount || 0}
            </Button>
            <Button
              size="sm"
              variant="light"
              radius="full"
              className="gap-x-[4px] !font-semibold"
              isLoading={isPassing}
              onPress={() => passQuestion(question.id)}
            >
              <MdOutlineEditOff className="w-4 h-4" /> Bỏ qua
            </Button>
          </div>
          <MoreActionsPopover
            actions={[
              {
                label: "Sao chép liên kết",
                icon: <FaLink />,
                onClick: () => {
                  const link = `${import.meta.env.VITE_FE}/question/${question.id}`;
                  navigator.clipboard.writeText(link).then(() => {
                    // Nếu muốn có thông báo khi copy thành công
                    toast.success("Đã lưu liên kết");
                  });
                },
              },
              {
                label: "Bỏ qua câu hỏi này",
                icon: <MdOutlineEditOff />,
                onClick: () => passQuestion(question.id),
                isLoading: isPassing,
              },
              {
                label: "Report",
                icon: <PiWarningBold />,
                onClick: () => setIsReportOpen(true),
              },
            ]}
          />
        </div>
        <AnswerModal
          onClose={onClose}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          question={question}
        />
        <AlertAction
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          onConfirm={handleDelete}
          title="Xoá câu hỏi này?"
          description="Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá chứ?"
          iconName="ph:trash"
          confirmText="Xoá"
          cancelText="Huỷ"
          isDanger
          loading={isDeleting}
        />
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          contentId={String(question.id)}
          contentType="question"
          contentPreview={question.title || "No title"}
        />
        {question && (
          <QuestionStatusModal
            isOpen={isStatusOpen}
            onOpenChange={onStatusOpenChange}
            questionId={question.id}
            currentStatus={question.interactionStatus}
          />
        )}
      </div>
    </motion.div>
  );
};

export default QuestionItem;
