import React from "react";
import {
  Question,
  QuestionResponse,
} from "../../../../store/interfaces/questionInterfaces";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FollowQuestion,
  UnfollowQuestion,
  CheckFollowStatus,
} from "../../../../services/FollowServices";
import { format } from "timeago.js";
import { PassQuestion } from "../../../../services/PassQuestionServices";
import { Link } from "react-router-dom";

// Định nghĩa interface cho props
interface QuestionItemProps {
  question: QuestionResponse;
  onDelete: (questionId: number) => void;
}

// Định nghĩa interface cho dữ liệu trả về từ CheckFollowStatus
interface FollowStatus {
  isFollowing: boolean;
}

// Định nghĩa context cho optimistic updates
interface MutationContext {
  previousFollowStatus: FollowStatus | undefined;
  previousQuestions: QuestionResponse[] | undefined;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onDelete }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  // Query để kiểm tra trạng thái follow
  const { data: isFollowing, isLoading: isCheckingFollow } = useQuery<
    FollowStatus,
    Error,
    boolean,
    ["followStatus", number]
  >({
    queryKey: ["follows", question.id],
    queryFn: () => CheckFollowStatus(question.id),
    select: (data: FollowStatus) => data.isFollowing,
  });

  // Mutation để follow
  const followMutation = useMutation<void, Error, number, MutationContext>({
    mutationFn: FollowQuestion,
    onMutate: async (questionId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", questionId],
      });
      await queryClient.cancelQueries({ queryKey: ["questions"] });

      const previousFollowStatus = queryClient.getQueryData<FollowStatus>([
        "followStatus",
        questionId,
      ]);
      const previousQuestions = queryClient.getQueryData<Question[]>([
        "questions",
      ]);

      // Optimistic update cho follow status
      queryClient.setQueryData<FollowStatus>(["followStatus", questionId], {
        isFollowing: true,
      });

      // Optimistic update cho question trong danh sách
      queryClient.setQueryData<QuestionResponse[]>(["questions"], (old) =>
        old?.map((q) =>
          q.id === questionId ? { ...q, followCount: q.followCount + 1 } : q
        )
      );

      return { previousFollowStatus, previousQuestions };
    },
    onError: (error, _questionId, context) => {
      if (context) {
        queryClient.setQueryData(
          ["followStatus", question.id],
          context.previousFollowStatus
        );
        queryClient.setQueryData(["questions"], context.previousQuestions);
      }
      toast.error(error.message || "Failed to follow question");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", question.id],
      });
      queryClient.invalidateQueries({ queryKey: ["follows", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const unfollowMutation = useMutation<void, Error, number, MutationContext>({
    mutationFn: UnfollowQuestion,
    onMutate: async (questionId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", questionId],
      });
      await queryClient.cancelQueries({ queryKey: ["questions"] });

      const previousFollowStatus = queryClient.getQueryData<FollowStatus>([
        "followStatus",
        questionId,
      ]);
      const previousQuestions = queryClient.getQueryData<Question[]>([
        "questions",
      ]);

      queryClient.setQueryData<FollowStatus>(["followStatus", questionId], {
        isFollowing: false,
      });

      queryClient.setQueryData<Question[]>(["questions"], (old) =>
        old?.map((q) =>
          q.id === questionId ? { ...q, followCount: q.followCount - 1 } : q
        )
      );

      return { previousFollowStatus, previousQuestions };
    },
    onError: (error, _questionId, context) => {
      if (context) {
        queryClient.setQueryData(
          ["followStatus", question.id],
          context.previousFollowStatus
        );
        queryClient.setQueryData(["questions"], context.previousQuestions);
      }
      toast.error(error.message || "Failed to unfollow question");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", question.id],
      });
      queryClient.invalidateQueries({ queryKey: ["follows", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  // Xử lý toggle follow/unfollow
  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate(question.id);
    } else {
      followMutation.mutate(question.id);
    }
  };

  // Mutation để pass question
  const passMutation = useMutation<void, Error, number>({
    mutationFn: PassQuestion,
    onSuccess: () => {
      toast.success("Question passed successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to pass question");
    },
  });

  const handlePass = () => {
    passMutation.mutate(question.id);
  };

  const date = new Date(question.lastFollowed).getTime();
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-t border-content3 p-4 relative ">
        <div className="flex items-center justify-between">
          <Link to={"/"} className="text-md font-bold hover:underline">
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
        <div className="flex items-center gap-x-1 opacity-80 text-xs flex-wrap !items-center mt-1 ">
          <button className="font-bold hover:underline">
            {question.answerCount} answers
          </button>
          <GoDotFill className="w-1 h-1 hidden sm:block" />
          <span>
            {question.lastFollowed
              ? `Last followed ${format(date)}`
              : `No one followed`}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-x-1 ">
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
              variant={isFollowing ? "solid" : "light"}
              radius="full"
              className={`gap-x-[4px] !font-semibold transition-all duration-200 ${isFollowing ? "shadow-md" : ""}`}
              onPress={handleFollowToggle}
              isLoading={
                followMutation.isPending ||
                unfollowMutation.isPending ||
                isCheckingFollow
              }
            >
              <FaRss className="w-4 h-4" />
              {isFollowing ? "Following" : "Follow"}
              <GoDotFill className="w-1 h-1 hidden sm:block" />
              {question.followCount}
            </Button>
            <Button
              size="sm"
              variant="light"
              radius="full"
              className="gap-x-[4px] !font-semibold"
              isLoading={passMutation.isPending}
              onPress={handlePass}
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
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <FaLink className="w-4 h-4" />
                Copy link
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <IoPersonAddSharp className="w-4 h-4" />
                Request answers
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
                onClick={handlePass}
                isLoading={passMutation.isPending}
              >
                <MdOutlineEditOff className="w-4 h-4" />
                Pass question
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <PiClockCountdownFill className="w-4 h-4" />
                Answer later
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <HiOutlineBell className="w-4 h-4" />
                Notify me about edits
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
                size="sm"
                radius="none"
              >
                <GrUnorderedList className="w-4 h-4" />
                View question log
              </Button>
              <Button
                className="hover:bg-content3 bg-transparent text-md font-light w-full !justify-start text-xs font-semibold"
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
