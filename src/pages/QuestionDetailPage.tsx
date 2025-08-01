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
import { useEffect, useRef, useState } from "react";
import ReportModal from "../components/Report/ReportModal";
import { FaChevronDown } from "react-icons/fa6";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { CiEdit } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { useGetUserInfo } from "../utils/getUserInfo";
import AlertAction from "../components/Common/AlertAction";
import { useDeleteQuestion } from "../hooks/questions/useDeleteQuestion";
import { IoIosSwitch } from "react-icons/io";
import { useAcceptAnswer } from "../hooks/answers/useAcceptAnswer";
import QuestionEditModal from "../components/Question/QuestionEdit/QuestionEditModal";
import StatusChip from "../components/Common/StatusChip";
import QuestionStatusModal from "../components/Question/QuestionEdit/QuestionStatusModal";
const MAX_LINES = 6;
const LINE_HEIGHT_PX = 24;

const QuestionDetailPage = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const {
    isOpen: isStatusOpen,
    onOpenChange: onStatusOpenChange,
    onOpen: onOpenStatusModal,
  } = useDisclosure(); // For status modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [typeOfComment, setTypeOfComment] = useState("recommended");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const userData = useGetUserInfo();
  const [openAlert, setOpenAlert] = useState(false);
  const { DeleteQuestion, isDeleting } = useDeleteQuestion();
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
  const handleDelete = () => {
    DeleteQuestion(questionDetail?.id || "");
    setOpenAlert(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      const maxHeight = MAX_LINES * LINE_HEIGHT_PX;
      // Chờ DOM render để đo chính xác
      requestAnimationFrame(() => {
        const scrollHeight = contentRef.current?.scrollHeight || 0;
        setIsOverflowing(scrollHeight > maxHeight);
      });
    }
  }, [questionDetail?.description]);
  const cleanContent = DOMPurify.sanitize(questionDetail?.description || "", {
    ADD_TAGS: ["ol", "ul", "li"],
  });
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
    <div className="flex flex-row w-full gap-x-4 mt-5 relative">
      <div className="w-full md:basis-[60%] flex justify-end">
        <div className="max-w-[95%] md:max-w-2xl w-full mx-auto md:mx-0">
          <div className="text-xl font-bold mb-2 !p-4 rounded-md  bg-content1">
            <div className="flex flex-row justify-between items-start mb-2">
              <div>
                {questionDetail?.status && (
                  <StatusChip
                    status={questionDetail.interactionStatus}
                    type="question"
                  />
                )}
              </div>
              {questionDetail &&
                questionDetail?.author?.id === userData?.id && (
                  <div className="flex items-center gap-x-2">
                    <Button
                      color="default"
                      radius="full"
                      className="w-fit mx-auto font-semibold "
                      size="sm"
                      onPress={() => onOpenStatusModal()} // New status update modal
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
                      onPress={() => onOpen()} // Mở modal edit
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
            <div className="underline mb-2">{questionDetail?.title}</div>
            {questionDetail?.description !== " " && (
              <motion.div
                ref={contentRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`relative bg-content1 py-1 text-sm  prose dark:prose-invert ${expanded ? "" : "line-clamp-5"} !w-full max-w-full px-0 ${!expanded && isOverflowing ? "overflow-hidden" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: expanded
                    ? cleanContent
                    : questionDetail?.description || "",
                }}
              />
            )}
            {isOverflowing && (
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setExpanded(!expanded)}
                  className="text-blue-500 font-semibold hover:underline mt-2 mr-3 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {expanded ? "Thu gọn" : "Tải thêm"}
                </motion.button>
              </div>
            )}
          </div>

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
      <div className="basis-[20%] h-fit md:sticky md:top-20 hidden md:block">
        {questionDetail && (
          <QuestionStatTab
            question={questionDetail}
            onOpen={onOpen}
            setIsReportOpen={setIsReportOpen}
          />
        )}
      </div>
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        contentId={String(questionDetail?.id)}
        contentType="question"
        contentPreview={questionDetail?.title || "Không có tiêu đề"}
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
      {questionDetail && (
        <QuestionEditModal
          question={questionDetail}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      {questionDetail && (
        <QuestionStatusModal
          isOpen={isStatusOpen}
          onOpenChange={onStatusOpenChange}
          questionId={questionDetail.id}
          currentStatus={questionDetail.interactionStatus}
        />
      )}
    </div>
  );
};

export default QuestionDetailPage;
