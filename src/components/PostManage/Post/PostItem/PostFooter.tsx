import { useEffect, useState } from "react";
import UpVote from "../../../Common/Button/UpVote";
import { PostFooterSkeleton } from "../../../Skeleton/PostSkeleton";

import { FaLink } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { GrUnorderedList } from "react-icons/gr";
import { LuKeyboardOff } from "react-icons/lu";
import { PiWarningBold } from "react-icons/pi";
import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import { cn } from "../../../../lib/utils";
import MoreActionsPopover from "../../../Common/MoreActionsPopover";
import ReportModal from "../../../Report/ReportModal";
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
  const [isReportOpen, setIsReportOpen] = useState(false);

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
      <MoreActionsPopover
        actions={[
          {
            label: "Sao chép liên kết",
            icon: <FaLink />,
            onClick: () => console.log("Copy link"),
          },
          {
            label: "Không quan tâm",
            icon: <LuKeyboardOff />,
            onClick: () => {},
          },
          {
            label: "Lưu",
            icon: <FaRegBookmark />,
            onClick: () => {},
          },
          { label: "Nhật ký", icon: <GrUnorderedList />, onClick: () => {} },
          {
            label: "Báo cáo",
            icon: <PiWarningBold />,
            onClick: () => setIsReportOpen(true),
          },
        ]}
      />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        contentId={String(post.id)}
        contentType="post"
        contentPreview={post.title || "No title"}
      />
    </div>
  );
};

export default PostFooter;
