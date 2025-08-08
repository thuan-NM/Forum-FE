import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import LoadingState from "../../Common/LoadingState";
import AnswerItem from "../../Answer/AnswerItem/AnswerItem";
import NotFind from "../../Common/NotFind";
import { AnswerResponse } from "../../../store/interfaces/answerInterfaces";
import { GetAllAnswers } from "../../../services";
import { TagResponse } from "../../../store/interfaces/tagInterfaces";
interface TagAnswerListProps {
  tag: TagResponse;
}
const TagAnswerList: React.FC<TagAnswerListProps> = ({ tag }) => {
  const { data, isLoading, isError, error } = useQuery<{
    answers: AnswerResponse[];
    total: number;
  }>({
    queryKey: ["answers"],
    queryFn: () => GetAllAnswers({ tagfilter: tag.id ,status: "approved" }),
  });

  if (isLoading) return <LoadingState message="Đang tải câu trả lời..." />;

  if (isError)
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">
          {error?.message || "Lỗi khi tải dữ liệu"}
        </p>
      </div>
    );

  return (
    <div className="mt-3 space-y-4">
      <AnimatePresence>
        {data?.answers && data?.answers?.length > 0 ? (
          data.answers.map((answer) => (
            <AnswerItem key={answer.id} answer={answer} />
          ))
        ) : (
          <NotFind
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
            title="answer"
            icon={
              <BsFileEarmarkPostFill className="size-10 !text-foreground/20" />
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagAnswerList;
