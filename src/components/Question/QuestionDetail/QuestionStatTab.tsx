import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { BiEdit } from "react-icons/bi";
import { useFollowItem } from "../../../hooks/follows/useFollowItem";
import { QuestionResponse } from "../../../store/interfaces/questionInterfaces";
import { FaLink, FaRss } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import MoreActionsPopover from "../../Common/MoreActionsPopover";
import { GrUnorderedList } from "react-icons/gr";
import { HiOutlineBell } from "react-icons/hi";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineEditOff } from "react-icons/md";
import { PiClockCountdownFill, PiWarningBold } from "react-icons/pi";
import { usePassQuestion } from "../../../hooks/questions/usePassQuestion";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetAllQuestions } from "../../../services";
import LoadingState from "../../Common/LoadingState";
import NotFind from "../../Common/NotFind";
import { BsFileEarmarkPostFill } from "react-icons/bs";
interface QuestionStatTabProps {
  question: QuestionResponse;
  onOpen: () => void;
  setIsReportOpen: (isReportOpen: boolean) => void;
}
const QuestionStatTab: React.FC<QuestionStatTabProps> = ({
  question,
  onOpen,
  setIsReportOpen,
}) => {
  const {
    isFollowing,
    isCheckingFollow,
    handleToggleFollow,
    isPending: isFollowPending,
  } = useFollowItem<QuestionResponse>(question.id, "questions");
  const { passQuestion, isPassing } = usePassQuestion();

  const navigate = useNavigate();
  const handlePassQuestion = () => {
    passQuestion(question.id);
    navigate("/");
  };
  const { data: questionsData, isLoading } = useQuery<{
    questions: QuestionResponse[];
    total: number;
  }>({
    queryKey: ["questions"],
    queryFn: () => GetAllQuestions({ limit: 10, topic_id: question.topic.id }),
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-x-2 items-center">
        <Button
          size="md"
          variant="bordered"
          color="primary"
          onPress={onOpen}
          radius="full"
          className=""
        >
          <BiEdit className="size-5" />
          Trả lời · {question.answersCount || 0}
        </Button>
        <Button
          size="md"
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
        <MoreActionsPopover
          actions={[
            { label: "Copy link", icon: <FaLink /> },
            { label: "Request answers", icon: <IoPersonAddSharp /> },
            {
              label: "Pass question",
              icon: <MdOutlineEditOff />,
              onClick: () => handlePassQuestion(),
              isLoading: isPassing,
            },
            { label: "Answer later", icon: <PiClockCountdownFill /> },
            { label: "Notify me about edits", icon: <HiOutlineBell /> },
            { label: "View question log", icon: <GrUnorderedList /> },
            {
              label: "Report",
              icon: <PiWarningBold />,
              onClick: () => setIsReportOpen(true),
            },
          ]}
          triggerIconClassName="size-6"
          size="md"
        />
      </div>
      <Card className="flex flex-col mt-3 rounded-md">
        <CardHeader className="text-sm font-semibold  border-b border-content4/20">
          Các câu hỏi liên quan:
        </CardHeader>

        {isLoading ? (
          <LoadingState message="Đang tải các câu hỏi liên quan" />
        ) : (
          <CardBody className="flex flex-col py-2 px-0 pb-4">
            {questionsData && questionsData?.questions?.length > 1 ? (
              questionsData?.questions?.map(
                (questionItem) =>
                  question.id !== questionItem.id && (
                    <Link
                      to={`/question/${questionItem.id}`}
                      key={questionItem.id}
                      className="px-4 line-clamp-1 flex flex-row items-center justify-between py-1 cursor-pointer hover:bg-content4/10 rounded-none text-sm"
                    >
                      {questionItem.title}
                    </Link>
                  )
              )
            ) : (
              <NotFind
                className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
                title="Không có câu hỏi liên quan nào"
              />
            )}
          </CardBody>
        )}
      </Card>
    </div>
  );
};

export default QuestionStatTab;
