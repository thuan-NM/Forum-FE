// ✅ CommentList.tsx
import { useState } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";

import CommentCreation from "./CommentCreation";
import CommentItem from "./CommentItem";
import { CommentResponse } from "../../store/interfaces/commentInterfaces";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import NotFind from "../Common/NotFind";
import { FaRegComment } from "react-icons/fa6";

type SortType = "recommended" | "most" | "least";

interface CommentListProps {
  comments: CommentResponse[];
  id: string;
  type: string;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  fetchNextPage,
  id,
  type,
  hasNextPage,
  isFetchingNextPage,
  isError,
  error,
}) => {
  const [typeOfComment, setTypeOfComment] = useState<SortType>("recommended");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleChange = (commentType: SortType) => {
    setTypeOfComment(commentType);
    setIsPopoverOpen(false);
  };

  const sortedComments = comments
    .filter(
      (comment): comment is CommentResponse =>
        comment !== null && comment !== undefined
    )
    .sort((a, b) => {
      if (typeOfComment === "most")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (typeOfComment === "least")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return 0;
    });

  return (
    <div>
      <CommentCreation id={id} type={type} />

      <div className="flex justify-between items-center my-3">
        <div className="font-semibold">Bình luận</div>
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
              {typeOfComment === "recommended" && "Đề xuất"}
              {typeOfComment === "most" && "Mới nhất"}
              {typeOfComment === "least" && "Cũ nhất"}
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
                  {type === "recommended" && "Đề xuất"}
                  {type === "most" && "Mới nhất"}
                  {type === "least" && "Cũ nhất"}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {sortedComments.length === 0 && (
        <NotFind
          className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 !rounded-lg"
          title="bình luận"
          icon={<FaRegComment className="size-10 !text-foreground/20" />}
        />
      )}
      {isError && (
        <ErrorState message={error?.message || "Lỗi tải bình luận."} />
      )}

      <motion.div layout>
        {sortedComments.map((comment) => (
          <motion.div
            key={comment.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-content3 py-4"
          >
            <CommentItem comment={comment} />
          </motion.div>
        ))}

        {isFetchingNextPage && (
          <LoadingState message="Đang tải thêm bình luận..." />
        )}

        {hasNextPage && !isFetchingNextPage && (
          <Button
            className="w-full font-semibold mt-4"
            size="sm"
            variant="bordered"
            radius="full"
            onPress={fetchNextPage}
          >
            Xem thêm bình luận <FaChevronDown className="ml-2" />
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default CommentList;
