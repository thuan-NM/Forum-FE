import React from "react";
import { QuestionResponse } from "../../../../store/interfaces/questionInterfaces";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { MdClear, MdOutlineEditOff } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { BiEdit } from "react-icons/bi";
import { FaLink, FaRss } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrUnorderedList } from "react-icons/gr";
import { PiWarningBold } from "react-icons/pi";
import { IoPersonAddSharp } from "react-icons/io5";
import { PiClockCountdownFill } from "react-icons/pi";
import { HiOutlineBell } from "react-icons/hi";
import { useDisclosure } from "@heroui/react";
import AnswerModal from "../Answer/AnswerModal";
import { motion } from "framer-motion";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

// ✅ Custom hooks
import { usePassQuestion } from "../../../../hooks/questions/usePassQuestion";
import { useFollowItem } from "../../../../hooks/follows/useFollowItem";

interface QuestionItemProps {
  question: QuestionResponse;
  onDelete: (questionId: string) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onDelete }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { passQuestion, isPassing } = usePassQuestion();

  const {
    isFollowing,
    isCheckingFollow,
    handleToggleFollow,
    isPending: isFollowPending,
  } = useFollowItem<QuestionResponse>(question.id, "questions");

  const date = question.lastFollowed
    ? new Date(question.lastFollowed).getTime()
    : null;

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
          <Button
            isIconOnly
            className="border-none cursor-pointer w-fit bg-transparent hover:bg-content3 rounded-full"
            size="sm"
            onPress={() => onDelete(question.id)}
          >
            <MdClear className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex gap-x-1 opacity-80 text-xs flex-wrap !items-center mt-1">
          <button className="font-bold hover:underline">
            {question.answersCount} answers
          </button>
          <GoDotFill className="w-1 h-1 hidden sm:block" />
          <span>
            {date ? `Last followed ${format(date)}` : `No one followed`}
          </span>
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
              <BiEdit className="w-5 h-5" /> Answer
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
              {isFollowing ? "Following" : "Follow"}
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
              <MdOutlineEditOff className="w-4 h-4" /> Pass
            </Button>
          </div>
          <Popover placement="top-start">
            <PopoverTrigger>
              <Button
                size="sm"
                variant="flat"
                radius="full"
                className="bg-transparent"
                isIconOnly
              >
                <HiOutlineDotsHorizontal className="text-lg cursor-pointer" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 rounded-sm bg-content1 w-min">
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <FaLink className="w-4 h-4" />
                Copy link
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <IoPersonAddSharp className="w-4 h-4" />
                Request answers
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
                onPress={() => passQuestion(question.id)}
                isLoading={isPassing}
              >
                <MdOutlineEditOff className="w-4 h-4" />
                Pass question
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <PiClockCountdownFill className="w-4 h-4" />
                Answer later
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <HiOutlineBell className="w-4 h-4" />
                Notify me about edits
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <GrUnorderedList className="w-4 h-4" />
                View question log
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <PiWarningBold className="w-4 h-4" />
                Report
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <AnswerModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          question={question}
        />
      </div>
    </motion.div>
  );
};

export default QuestionItem;
