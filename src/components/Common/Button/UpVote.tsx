import { Button, Tooltip } from "@heroui/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useReactItem } from "../../../hooks/reactions/useReactItem";

interface PostFooterProps {
  setIsShowComment?: (show: boolean) => void;
  isShowComment?: boolean;
  totalComment?: number;
  postId: string;
}

const UpVote: React.FC<PostFooterProps> = ({
  setIsShowComment,
  isShowComment,
  totalComment,
  postId,
}) => {
  const {
    hasReacted,
    reactionsCount,
    isCheckingReaction,
    handleToggleReaction,
    isPending,
  } = useReactItem<{ id: string; reactionsCount?: number }>(postId, "posts");

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-2 items-center">
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
              className={`rounded-full bg-transparent hover:bg-content3 transition-colors duration-200 ${
                isPending || isCheckingReaction
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleToggleReaction}
              disabled={isPending || isCheckingReaction}
            >
              {hasReacted ? (
                <AiFillLike className="size-5 text-primary" />
              ) : (
                <AiOutlineLike className="size-5 text-foreground" />
              )}
              <span className="text-xs">{hasReacted ? "Unlike" : "Like"}</span>
            </Button>
            <span className="text-xs">{reactionsCount}</span>
          </div>
        </Tooltip>
        <Tooltip content="Comment" placement="top" offset={5} closeDelay={100}>
          <div className="rounded-full p-1 px-3 flex items-center !text-sm gap-x-2 group cursor-pointer">
            <Button
              size="sm"
              isLoading={isCheckingReaction} // Thêm loading khi kiểm tra reaction
              className="rounded-full bg-transparent hover:bg-content3 transition-colors duration-200"
              onClick={() => setIsShowComment?.(!isShowComment)}
              disabled={!setIsShowComment || isCheckingReaction}
            >
              <FaRegComment className="size-5" />
              <span className="text-xs">Comments</span>
            </Button>
            <span className="text-xs">{totalComment ?? 0}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default UpVote;
