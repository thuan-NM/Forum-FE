import { Button, Tooltip } from "@heroui/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

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
        <Tooltip
          content="Like"
          placement={"top"}
          offset={5}
          closeDelay={100}
        >
          <div className="rounded-full p-1 px-3  flex items-center !text-sm gap-x-2 group ">
            <Button
              size="sm"
              className="rounded-full bg-transparent group-hover:bg-content3 cursor-pointer"
            >
              <AiFillLike className="size-5 text-foreground" />
              <span className="text-xs">Like</span>
            </Button>
            <span className="text-xs">1</span>
          </div>
        </Tooltip>
        <Tooltip
          content="Comment"
          placement={"top"}
          offset={5}
          closeDelay={100}
        >
          <div className="rounded-full p-1 px-3  flex items-center !text-sm gap-x-2 group cursor-pointer">
            <Button
              size="sm"
              className="rounded-full bg-transparent group-hover:bg-content3"
              onClick={() => setIsShowComment?.(!isShowComment)}
            >
              <FaRegComment className="size-5" />
              <span className="text-xs">Comments</span>
            </Button>
            <span className="text-xs">1</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default UpVote;
