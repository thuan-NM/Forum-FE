import { useState } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import CommentCreation from "./CommentCreation";
import CommentItem from "./CommentItem";
import { getAllComments } from "../../../../services";
import { CommentResponse } from "../../../../store/interfaces/commentInterfaces";
import { useQuery } from "@tanstack/react-query";
import LoadingState from "../../../Common/LoadingState";
import ErrorState from "../../../Common/ErrorState";

type SortType = "recommended" | "most" | "least";

interface CommentListProps {
  comment: CommentResponse[];
}

const CommentList = () => {
  const [typeOfComment, setTypeOfComment] = useState<SortType>("recommended");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(5);

  const handleChange = (commentType: SortType) => {
    setTypeOfComment(commentType);
    setIsPopoverOpen(false);
  };

  const { data, isLoading, isError, error } = useQuery<{
    comments: CommentResponse[];
    total: number;
  }>({
    queryKey: ["comments", limit],
    queryFn: () => getAllComments({ limit: limit }),
  });

  const sortedComments = data?.comments
    ? [...data.comments].sort((a, b) => {
        if (typeOfComment === "most")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (typeOfComment === "least")
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        return 0;
      })
    : [];

  const commentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <CommentCreation />

      <div className="flex justify-between items-center my-3">
        <div className="font-semibold">Comments {limit}</div>
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
              {(["recommended", "most", "least"] as SortType[]).map((type) => (
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

      {isLoading && <LoadingState message="Loading comments..." />}
      {isError && (
        <ErrorState message={error?.message || "Error loading comments."} />
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <AnimatePresence>
          {sortedComments.map((comment) => (
            <motion.div
              key={comment.id}
              variants={commentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className="border-t border-content3 py-4"
            >
              <CommentItem comment={comment} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {sortedComments.length > 0 && (
        <Button
          className="w-full font-semibold mt-4"
          size="sm"
          variant="bordered"
          radius="full"
          onPress={() => setLimit(limit + 5)}
        >
          View more comments <FaChevronDown className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default CommentList;
