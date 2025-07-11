import { useEffect, useState } from "react";
import UpVote from "../../../Common/Button/UpVote";
import { PostFooterSkeleton } from "../../../Skeleton/PostSkeleton";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaLink } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { GrUnorderedList } from "react-icons/gr";
import { LuKeyboardOff } from "react-icons/lu";
import { PiWarningBold } from "react-icons/pi";
import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import { cn } from "../../../../lib/utils";
interface PostFooterProps {
  post: PostResponse;
  setIsShowComment?: (show: boolean) => void;
  isShowComment?: boolean;
  totalComment?: number;
}
const PostFooter: React.FC<PostFooterProps> = ({
  setIsShowComment,
  isShowComment,
  totalComment,
  post,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  }, []);

  if (loading) {
    return <PostFooterSkeleton />;
  }

  return (
    <div
      className={cn(
        "flex justify-between items-center mt-2 py-1  border-content3",
        isShowComment ? "border-y" : "border-t"
      )}
    >
      <UpVote
        postId={post.id}
        setIsShowComment={setIsShowComment}
        isShowComment={isShowComment}
        totalComment={totalComment}
      />
      <Popover placement="top-start">
        <PopoverTrigger>
          <Button
            size="sm"
            variant="flat"
            radius="full"
            className="bg-tranparent"
            isIconOnly
          >
            <HiOutlineDotsHorizontal className="text-lg cursor-pointer" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 rounded-sm bg-content1 w-1/3">
          <div className="">
            <Button
              className="bg-tranparent text-md  w-full !justify-start text-xs font-semibold"
              size="sm"
              radius="none"
            >
              <FaLink className="w-4 h-4" />
              Copy link
            </Button>
            <Button
              className="bg-tranparent text-md  w-full !justify-start text-xs font-semibold"
              size="sm"
              radius="none"
            >
              <LuKeyboardOff className="w-4 h-4" />
              Not interested in this
            </Button>
            <Button
              className="bg-tranparent text-md  w-full !justify-start text-xs font-semibold"
              size="sm"
              radius="none"
            >
              <FaRegBookmark className="w-4 h-4" />
              Bookmark
            </Button>
            <Button
              className="bg-tranparent text-md  w-full !justify-start text-xs font-semibold"
              size="sm"
              radius="none"
            >
              <GrUnorderedList className="w-4 h-4" />
              Log
            </Button>
            <Button
              className="bg-tranparent text-md  w-full !justify-start text-xs font-semibold"
              size="sm"
              radius="none"
            >
              <PiWarningBold className="w-4 h-4" />
              Report
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PostFooter;
