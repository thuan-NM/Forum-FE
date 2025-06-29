import { AnimatePresence } from "framer-motion";
import { FaRegLightbulb, FaChevronRight } from "react-icons/fa6";
import QuestionItem from "./QuestionItem/QuestionItem";
import { QuestionResponse } from "../../../store/interfaces/questionInterfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteQuestion,
  GetAllQuestions,
} from "../../../services/QuestionServices";
import { QuestionSkeleton } from "../../Skeleton/QuestionSkeleton";
import toast from "react-hot-toast";
import NotFind from "../../Common/NotFind";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const { data, isLoading, isError, error } = useQuery<{
    questions: QuestionResponse[];
    total: number;
  }>({
    queryKey: ["questions"],
    queryFn: () => GetAllQuestions({}),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: (data) => {
      toast.success(data?.message || "Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete question"
      );
    },
  });

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  if (isLoading) {
    return (
      <div className="my-3 text-center">
        <QuestionSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="my-3 text-center">
        <p className="text-red-500">{error?.message || "An error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="bg-content1 mt-3 !rounded-lg my-3 relative">
      <Button
        onPress={() => navigate("/answer")}
        variant="ghost"
        className="!border-0 rounded-b-none flex items-center justify-between w-full !rounded-t-lg hover:bg-content3 transition duration-200 ease-in-out p-3 py-2"
      >
        <div className="flex items-center gap-x-2">
          <div className="bg-red-500 w-6 h-6 flex items-center justify-center rounded-md text-white !p-0">
            <FaRegLightbulb className="text-base !p-0" />
          </div>
          <span className="text-xs">Questions for you</span>
        </div>
        <FaChevronRight />
      </Button>
      <AnimatePresence>
        {data?.questions && data.questions.length > 0 ? (
          data.questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <NotFind
            title="questions"
            className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6"
            icon={<FaRegLightbulb className="size-10 !text-foreground/20" />}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionList;