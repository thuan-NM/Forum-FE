import { Button, Tooltip } from "@heroui/react";
import { AiOutlineLike } from "react-icons/ai";

import { FaRegComment } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";

interface PostFooterProps {
  setIsShowComment?: (show: boolean) => void;
  isShowComment?: boolean;
}

const UpVote: React.FC<PostFooterProps> = ({
  setIsShowComment,
  isShowComment,
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-2 items-center">
        <div>
          <div className="rounded-full p-1 px-3  flex items-center !text-sm gap-x-1 group">
            <Button isIconOnly size="sm" className="rounded-full bg-transparent group-hover:bg-content3">
              <AiOutlineLike className="size-5" fill="bg-blue-500" />
            </Button>
            <span className="text-xs">Like</span>
            <span className="text-xs">1</span>
          </div>
        </div>
        <Tooltip
          content="Comment"
          placement={"top"}
          offset={5}
          closeDelay={100}
        >
          <button
            className="rounded-full p-1 px-3 hover:bg-content3 flex items-center text-sm gap-x-1"
            onClick={() => setIsShowComment?.(!isShowComment)}
          >
            <FaRegComment className="" />
            <span className="text-xs">1</span>
          </button>
        </Tooltip>
        <Tooltip content="Share" placement={"top"} offset={5} closeDelay={100}>
          <button className="rounded-full p-1 px-3 hover:bg-content3 flex items-center text-sm gap-x-1">
            <FaRegShareFromSquare />
            <span className="text-xs">1</span>
          </button>
        </Tooltip>
      </div>
      {/* Conditionally render CommentList with animation */}
    </div>
  );
};

export default UpVote;
