import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { format } from "timeago.js";
import { CommentResponse } from "../../../../store/interfaces/commentInterfaces";
import { useQuery } from "@tanstack/react-query";
import { ListReplies } from "../../../../services";
import { useState } from "react";
import DOMPurify from "dompurify";
import CommentCreation from "./CommentCreation";
import { useReactItem } from "../../../../hooks/reactions/useReactItem";

interface CommentItemProps {
  comment: CommentResponse;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [hasReplies, setHasReplies] = useState(comment.has_replies || false);

  const { data: reply, isLoading: isLoadingReplies } = useQuery<{
    replies: CommentResponse[];
    total: number;
  }>({
    queryKey: ["replies", comment.id],
    queryFn: () => ListReplies({ comment_id: comment.id, limit: 5 }),
    enabled: showReplies,
  });

  const {
    hasReacted,
    reactionsCount,
    isCheckingReaction,
    handleToggleReaction,
    isPending,
  } = useReactItem<{ id: string; reactionsCount?: number }>(
    comment.id.toString(),
    "comments"
  );

  return (
    <div className="flex mt-4" style={{ marginLeft: `${level * 5}px` }}>
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
        <Avatar
          size="sm"
          radius="full"
          className="w-full h-full object-cover"
          src={`https://i.pravatar.cc/150?img=${comment.author}`}
        />
      </div>
      <div className="flex flex-col gap-y-1 pl-2 !text-xs md:text-sm w-full">
        <div className="flex gap-x-1">
          <div className="font-bold flex flex-wrap items-center gap-x-1">
            <div>{comment.author.fullName}</div>
            <GoDotFill className="w-2 h-2 hidden sm:block" />
          </div>
          <div className="opacity-90 text-xs flex flex-wrap !items-center">
            <div>{format(comment.createdAt)}</div>
          </div>
        </div>
        <div>
          <div
            className="text-sm ml-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(comment.content),
            }}
          />
          <div className="flex justify-between items-center">
            <div className="w-fit mt-2 flex gap-x-2 flex-row items-center">
              <Tooltip
                content={hasReacted ? "Unlike" : "Like"}
                placement="top"
                offset={5}
                closeDelay={100}
              >
                <div className="rounded-full p-1 px-3 flex items-center !text-sm gap-x-2 group">
                  <Button
                    size="sm"
                    isLoading={isCheckingReaction || isPending}
                    className={`rounded-full bg-transparent group-hover:bg-content3 cursor-pointer ${
                      isPending || isCheckingReaction
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onPress={handleToggleReaction}
                    disabled={isPending || isCheckingReaction}
                  >
                    {hasReacted ? (
                      <AiFillLike className="size-5 text-primary" />
                    ) : (
                      <AiOutlineLike className="size-5 text-foreground" />
                    )}
                    <span className="text-xs">
                      {hasReacted ? "Unlike" : "Like"}
                    </span>
                  </Button>
                  <span className="text-xs">{reactionsCount}</span>
                </div>
              </Tooltip>
              <Button
                size="sm"
                variant="light"
                radius="full"
                onPress={() => setShowReplyForm((prev) => !prev)}
              >
                {showReplyForm ? "Cancel" : "Reply"}
              </Button>
            </div>
            <Popover placement="top-start">
              <PopoverTrigger className="flex items-center">
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
              <PopoverContent className="p-0">
                <div className="flex flex-col !items-start rounded-full">
                  <Button
                    className="bg-content1 hover:bg-content2 text-md w-full !justify-start text-xs font-semibold"
                    size="sm"
                    radius="none"
                  >
                    Report
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {showReplyForm && (
            <div className="mt-2 ml-2">
              <CommentCreation
                id={comment.id}
                type="parent_id"
                onSuccess={() => {
                  setHasReplies(true);
                  setShowReplyForm(false);
                }}
              />
            </div>
          )}

          {hasReplies && (
            <div className="mt-2 ml-2">
              <Button
                variant="light"
                size="sm"
                radius="full"
                onPress={() => setShowReplies(!showReplies)}
                className="text-xs font-semibold"
                isLoading={isLoadingReplies}
              >
                {isLoadingReplies
                  ? "Loading..."
                  : showReplies
                    ? "Hide replies"
                    : `Show ${reply?.total || ""} replies`}
              </Button>

              {showReplies && reply && reply?.total > 0 && (
                <div className="reply-comment mt-4">
                  {reply.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
