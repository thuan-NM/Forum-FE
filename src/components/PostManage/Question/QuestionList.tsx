import { AnimatePresence } from "framer-motion";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import QuestionItem from "./QuestionItem/QuestionItem";
import { Question } from "../../../store/interfaces/questionInterfaces";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteQuestion, GetQuestion } from "../../../services/QuestionServices";
import { Skeleton } from "@heroui/react";
import { QuestionSkeleton } from "../../Skeleton/QuestionSkeleton";
import toast from "react-hot-toast";
const QuestionList = () => {
    const { data = [], isLoading, isError, error } = useQuery<Question[]>({
        queryKey: ["questions"],
        queryFn: GetQuestion,
    });

    const [questionsData, setQuestionsData] = useState<Question[]>(data)
    useEffect(() => {
        setQuestionsData(data);
    }, [data]);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteQuestion,
        onSuccess: (data) => {
            toast.success(data?.message);
            setQuestionsData((prevPosts) =>
                prevPosts.filter((question) => question.id !== data?.id)
            );
            queryClient.invalidateQueries({ queryKey: ["questions"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const handleDelete = (postId: number) => {
        deleteMutation.mutate(postId);
    };

    if (isLoading) {
        return (
            <div className="my-3 text-center">
                <Skeleton className="w-full h-32 rounded-lg" />
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
        <div className="bg-content2 mt-3 bg-content2 !rounded-lg my-3 relative">
            <button className="flex items-center justify-between w-full !rounded-t-lg hover:bg-content3 transition duration-200 ease-in-out p-3 py-2">
                <div className="flex items-center gap-x-2">
                    <div className="bg-red-500 w-6 h-6 flex items-center justify-center rounded-md text-white !p-0">
                        <FaRegLightbulb className="text-base !p-0" />
                    </div>
                    <span className="text-xs">Questions for you </span>
                </div>
                <FaChevronRight />
            </button>
            <AnimatePresence>
                {isLoading ?
                    <QuestionSkeleton />
                    : (
                        <>
                            {questionsData.map((question) => (
                                <QuestionItem
                                    key={question.id}
                                    question={question}
                                    onDelete={handleDelete}
                                />
                            ))}</>)}

            </AnimatePresence>
        </div>
    )
}

export default QuestionList