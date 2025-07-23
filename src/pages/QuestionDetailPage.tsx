import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GetQuestionById } from "../services";
import { QuestionResponse } from "../store/interfaces/questionInterfaces";
import LoadingState from "../components/Common/LoadingState";
import {
  Button,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { BiEdit } from "react-icons/bi";
import AnswerList from "../components/Answer/AnswerList";
import AnswerModal from "../components/Answer/AnswerModal";
import QuestionStatTab from "../components/Question/QuestionDetail/QuestionStatTab";
import { useState } from "react";
import ReportModal from "../components/Report/ReportModal";
import { FaChevronDown } from "react-icons/fa6";

const QuestionDetailPage = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [typeOfComment, setTypeOfComment] = useState("recommended");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const { id } = useParams();
  const {
    data: questionDetail,
    isLoading,
    isError,
    error,
  } = useQuery<QuestionResponse>({
    queryKey: ["questions", id],
    queryFn: () => GetQuestionById(id || ""),
  });
  const handleChange = (commentType: string) => {
    setTypeOfComment(commentType);
    setIsPopoverOpen(false);
  };
  if (isLoading) {
    return <LoadingState message="Đang tải dữ liệu câu trả lời..." />;
  }
  if (isError) {
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-row w-full gap-x-4 mt-5">
      <div className="basis-[60%] flex justify-end">
        <div className="max-w-2xl w-full ">
          <div className="text-xl font-bold">{questionDetail?.title}</div>
          <div className="flex-col  bg-content1 rounded-md flex justify-center items-center mt-4 py-8">
            <Image
              src={
                questionDetail?.author?.avatar ||
                "https://i.pravatar.cc/150?u=a04258114e29026702d"
              }
              alt={questionDetail?.author?.fullName || "avatar"}
              width={40}
              height={40}
              className="rounded-full "
            />
            <div className="font-semibold text-base">
              {questionDetail?.author?.fullName}, bạn có thể trả lời câu hỏi này
              không?
            </div>
            <div className="text-sm dark:text-white/30 text-black/30">
              Mọi người đang tìm kiếm câu trả lời tốt hơn cho câu hỏi này.
            </div>
            <Button
              color="primary"
              radius="full"
              className="w-fit mx-auto mt-4 font-semibold"
              onPress={onOpen}
              variant="bordered"
            >
              <BiEdit className="size-5" />
              Trả lời câu hỏi
            </Button>
          </div>
          <div className="">
            <div className="flex justify-between items-center mt-4">
              <Button
                size="sm"
                variant="light"
                className="text-sm dark:text-white/70 text-black/70 rounded-full "
              >
                Các câu trả lời ({questionDetail?.answersCount})
              </Button>
              <Popover
                showArrow
                offset={20}
                placement="left"
                isOpen={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
              >
                <PopoverTrigger className="flex items-center">
                  <Button
                    variant="light"
                    radius="full"
                    className="px-2 py-0 font-semibold text-xs"
                    size="sm"
                  >
                    {typeOfComment === "recommended" && "Recommended"}
                    {typeOfComment === "most" && "Most recent"}
                    {typeOfComment === "least" && "Least recent"}
                    <FaChevronDown className="ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <div className="flex flex-col !items-start">
                    {["recommended", "most", "least"].map((type) => (
                      <Button
                        key={type}
                        className={`bg-content1 hover:bg-content2 text-xs font-semibold w-full !justify-start ${
                          typeOfComment === type ? "text-primary" : ""
                        }`}
                        size="sm"
                        radius="none"
                        onPress={() => handleChange(type)}
                      >
                        {type === "recommended" && "Recommended"}
                        {type === "most" && "Most recent"}
                        {type === "least" && "Least recent"}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <AnswerList questionId={id || ""} />
            </div>
          </div>
        </div>
      </div>
      <div className="basis-[20%]">
        {questionDetail && (
          <QuestionStatTab
            question={questionDetail}
            onOpen={onOpen}
            setIsReportOpen={setIsReportOpen}
          />
        )}
      </div>
      {questionDetail && (
        <AnswerModal
          question={questionDetail}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        contentId={String(questionDetail?.id)}
        contentType="question"
        contentPreview={questionDetail?.title || "No title"}
      />
    </div>
  );
};

export default QuestionDetailPage;
