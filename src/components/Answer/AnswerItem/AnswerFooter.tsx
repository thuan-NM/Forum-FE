import { useEffect, useState } from "react";

import { FaLink } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { GrUnorderedList } from "react-icons/gr";
import { LuKeyboardOff } from "react-icons/lu";
import { PiWarningBold } from "react-icons/pi";
import { AnswerResponse } from "../../../store/interfaces/answerInterfaces";
import ReportModal from "../../Report/ReportModal";
import MoreActionsPopover from "../../Common/MoreActionsPopover";
import { cn } from "../../../lib/utils";
import { AnswerFooterSkeleton } from "../../Skeleton/AnswerSkeleton";
import Reaction from "./Reaction";

interface AnswerFooterProps {
  answer: AnswerResponse;
  setIsShowComment?: (show: boolean) => void;
  isShowComment?: boolean;
  totalComment?: number;
}
const AnswerFooter: React.FC<AnswerFooterProps> = ({
  setIsShowComment,
  isShowComment,
  totalComment,
  answer,
}) => {
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  }, []);

  if (loading) {
    return <AnswerFooterSkeleton />;
  }

  return (
    <div
      className={cn(
        "flex justify-between items-center mt-2 py-1  border-content3",
        isShowComment ? "border-y" : "border-t"
      )}
    >
      <Reaction
        id={answer.id}
        setIsShowComment={setIsShowComment}
        isShowComment={isShowComment}
        totalComment={totalComment}
      />
      <MoreActionsPopover
        actions={[
          {
            label: "Copy link",
            icon: <FaLink />,
            onClick: () => console.log("Copy link"),
          },
          {
            label: "Not interested",
            icon: <LuKeyboardOff />,
            onClick: () => {},
          },
          { label: "Bookmark", icon: <FaRegBookmark />, onClick: () => {} },
          { label: "Log", icon: <GrUnorderedList />, onClick: () => {} },
          {
            label: "Report",
            icon: <PiWarningBold />,
            onClick: () => setIsReportOpen(true),
          },
        ]}
      />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        contentId={String(answer.id)}
        contentType="answer"
        contentPreview={answer.title || "No title"}
      />
    </div>
  );
};

export default AnswerFooter;
