import { Avatar, Button, Tooltip } from "@heroui/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { format } from "timeago.js";
import { CommentResponse } from "../../store/interfaces/commentInterfaces";
import { useQuery } from "@tanstack/react-query";
import { ListReplies } from "../../services";
import { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import CommentCreation from "./CommentCreation";
import { useReactItem } from "../../hooks/reactions/useReactItem";
import MoreActionsPopover from "../Common/MoreActionsPopover";
import { PiWarningBold } from "react-icons/pi";
import ReportModal from "../Report/ReportModal";
import { stripHTML } from "../../utils/stripHTML";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdClear } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import AlertAction from "../Common/AlertAction";
import { useDeleteComment } from "../../hooks/comments/useDeleteComment";
import { useGetUserInfo } from "../../utils/getUserInfo";
import TiptapEditor from "../TextEditor/Tiptap";
import MenuBar from "../TextEditor/MenuBar";
import EditorModal from "../TextEditor/EditorModal";
import { useUploadImages } from "../../hooks/attachments/useUploadAttachment";
import { useUpdateComment } from "../../hooks/comments/useUpdateComment";

interface CommentItemProps {
  comment: CommentResponse;
  level?: number;
}

const MAX_LINES = 5;
const LINE_HEIGHT_PX = 20;

const CommentItem: React.FC<CommentItemProps> = ({ comment, level = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [hasReplies, setHasReplies] = useState(comment.has_replies || false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [textContent, setTextContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const userData = useGetUserInfo();
  const { deleteComment, isDeleting } = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const [content, setContent] = useState<string>(comment.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const { processContentWithUploads, isUploading } = useUploadImages();
  const { updateComment, isUpdating } = useUpdateComment();

  const { data: reply, isLoading: isLoadingReplies } = useQuery<{
    replies: CommentResponse[];
    total: number;
  }>({
    queryKey: ["replies", comment.id],
    queryFn: () =>
      ListReplies({
        comment_id: comment.id,
        filter: { limit: 5, status: "approved" },
      }),
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

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(comment.content, "text/html");

    const cleanText = DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_TAGS: ["ol", "ul", "li"],
    });
    setTextContent(cleanText);
  }, [comment.content]);

  useEffect(() => {
    if (contentRef.current) {
      const maxHeight = MAX_LINES * LINE_HEIGHT_PX;
      // Chờ DOM render để đo chính xác
      requestAnimationFrame(() => {
        const scrollHeight = contentRef.current?.scrollHeight || 0;
        setIsOverflowing(scrollHeight > maxHeight);
      });
    }
  }, [textContent]);

  const cleanContent = DOMPurify.sanitize(comment.content, {
    ADD_TAGS: ["ol", "ul", "li"],
  });

  const handleDelete = () => {
    deleteComment(comment);
    setOpenAlert(false);
  };
  const handleSubmit = async () => {
    try {
      const processedContent = await processContentWithUploads(content);

      const updatedComment = {
        ...comment,
        content: processedContent, // gán content đã xử lý
      };

      updateComment(comment.id, updatedComment); // gửi bản đã cập nhật
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
    }
  };

  return (
    <div className="flex mt-4" style={{ marginLeft: `${level * 5}px` }}>
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
        <Avatar
          size="sm"
          radius="full"
          className="w-full h-full object-cover"
          src={
            comment.author.avatar
              ? comment.author.avatar
              : `https://i.pravatar.cc/150?img=${comment.author}`
          }
        />
      </div>
      <div className="flex flex-col gap-y-1 pl-2 !text-xs md:text-sm w-full">
        <div className="flex gap-x-1">
          <div className="font-bold flex flex-wrap items-center gap-x-1">
            <Link
              to={`/users/${comment.author.id}`}
              className="hover:underline cursor-pointer"
            >
              {comment.author.fullName}
            </Link>
            <GoDotFill className="w-2 h-2 hidden sm:block" />
          </div>
          <div className="opacity-90 text-xs flex flex-wrap !items-center">
            <div>{format(comment.createdAt)}</div>
          </div>
        </div>
        <div>
          {!isEditing ? (
            <>
              <motion.div
                ref={contentRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`relative bg-content1 py-1 text-sm prose dark:prose-invert ${expanded ? "" : "line-clamp-5"} !w-full max-w-full px-0 ${!expanded && isOverflowing ? "overflow-hidden" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: expanded ? cleanContent : textContent,
                }}
              />

              {isOverflowing && (
                <div className="flex justify-end">
                  <motion.button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 font-semibold hover:underline mt-2 mr-3 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expanded ? "Thu gọn" : "Tải thêm"}
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="flex !w-full flex-col !bg-content2 rounded-md py-1 pt-2">
              <TiptapEditor
                initialContent={comment.content}
                className="h-fit max-h-[400px] min-h-0 border-none !rounded-none p-0 px-5 !bg-content2"
                containerClassName="!rounded-none shadow-none max-h-auto !bg-content2 max-h-[400px] min-h-0 overflow-y-auto scrollbar-hide"
                onChange={(value) => {
                  setContent(value);
                }}
                isDisabled={false}
                setEditor={setEditor}
              />
              <div className="flex items-center relative z-10 mt-4 mb-2">
                <AnimatePresence initial={false}>
                  {editor ? (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                    >
                      <MenuBar
                        editor={editor}
                        onAddImage={() => setOpenImage(true)}
                        onAddYoutube={() => setOpenYoutube(true)}
                        include={["image", "emoji"]}
                        setShowEmojiPicker={() =>
                          setShowEmojiPicker(!showEmojiPicker)
                        }
                        className="z-10 mx-2"
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            {!isEditing ? (
              <>
                <div className="w-fit mt-2 flex gap-x-2 flex-row items-center">
                  <Tooltip
                    content={hasReacted ? "Bỏ thích" : "Thích"}
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
                          {hasReacted ? "Bỏ thích" : "Thích"}
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
                    {showReplyForm ? "Hủy" : "Phản hồi"}
                  </Button>
                </div>
                <div className="flex items-center gap-x-2">
                  {comment.author.id === userData?.id && (
                    <>
                      <Button
                        color="default"
                        radius="full"
                        className="w-fit mx-auto font-semibold "
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={() => setIsEditing(true)}
                      >
                        <CiEdit className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        className="border-none cursor-pointer w-fit bg-transparent hover:bg-content3 rounded-full"
                        size="sm"
                        onPress={() => setOpenAlert(true)}
                      >
                        <MdClear className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  <MoreActionsPopover
                    actions={[
                      {
                        label: "Báo cáo",
                        icon: <PiWarningBold />,
                        onClick: () => setIsReportOpen(true),
                      },
                    ]}
                  />
                </div>
              </>
            ) : (
              <div className="flex justify-end gap-x-2 mt-2">
                <Button
                  size="sm"
                  variant="light"
                  radius="full"
                  onPress={() => setIsEditing(false)}
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  radius="full"
                  isLoading={isUpdating || isUploading}
                  onPress={handleSubmit}
                >
                  Lưu
                </Button>
              </div>
            )}
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
                  ? "Đang tải..."
                  : showReplies
                    ? "Ẩn phản hồi"
                    : `Xem ${reply?.total || ""} phản hồi`}
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
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        contentId={String(comment.id)}
        contentType="comment"
        contentPreview={stripHTML(comment.content) || "Không có nội dung"}
      />
      <AlertAction
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDelete}
        title="Xoá bình luận này?"
        description="Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá chứ?"
        iconName="ph:trash"
        confirmText="Xoá"
        cancelText="Huỷ"
        isDanger
        loading={isDeleting}
      />
      {isEditing && (
        <EditorModal
          editor={editor}
          setOpenImage={setOpenImage}
          setOpenYoutube={setOpenYoutube}
          openImage={openImage}
          openYoutube={openYoutube}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          emojiClassName="!absolute !top-10 !right-20 z-[20]"
        />
      )}
    </div>
  );
};

export default CommentItem;
