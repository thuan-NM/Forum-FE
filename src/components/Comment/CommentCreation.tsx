import { Avatar, Button } from "@heroui/react";
import TiptapEditor from "../TextEditor/Tiptap";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MenuBar from "../TextEditor/MenuBar";
import { motion } from "framer-motion";
import EditorModal from "../TextEditor/EditorModal";
import { useCreateComment } from "../../hooks/comments/useCreateComment";
import { useUploadImages } from "../../hooks/attachments/useUploadAttachment";
import AlertAction from "../Common/AlertAction"; // Import AlertAction (giả sử path đúng)
import { useAutomaticModeration } from "../../hooks/automatic_moderations/useAutomaticModeration";
import { stripHTML } from "../../utils/stripHTML";
import { useGetUserInfo } from "../../utils/getUserInfo";

interface Props {
  id: string;
  type: string;
  onSuccess?: () => void;
}

const CommentCreation: React.FC<Props> = ({ id, type, onSuccess }) => {
  const [editor, setEditor] = useState<any>(null);
  const [content, setContent] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false); // State cho confirm modal
  const { createComment, isCreating } = useCreateComment();
  const { processContentWithUploads, isUploading } = useUploadImages();
  const { automaticModeration, isModerating } = useAutomaticModeration();
  const user = useGetUserInfo();
  const handleSubmit = async () => {
    try {
      const processedContent = await processContentWithUploads(content);

      // Kiểm duyệt tự động trước
      const moderationResult = await automaticModeration(stripHTML(content));

      let data = {
        content: processedContent,
        [`${type}`]: id,
      };

      if (moderationResult.label === "hop_le") {
        // Giả sử "clean" nghĩa là không vi phạm
        data.status = "approved"; // Set approved nếu ok
        createComment(data);
        onSuccess?.();
        if (editor) {
          editor.commands.clearContent();
        }
        setContent("");
      } else {
        // Vi phạm: Show confirm
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error);
    }
  };

  const handleConfirm = () => {
    // User confirm vi phạm: Gửi mà không set status (backend default pending)
    const data = {
      content: content, // Đã processed
      [`${type}`]: id,
      // Không set status
    };
    createComment(data);
    onSuccess?.();
    if (editor) {
      editor.commands.clearContent();
    }
    setContent("");
    setShowConfirm(false);
  };

  return (
    <div className="flex pt-3 items-start gap-x-2  !py-3 bg-content1 rounded-lg ">
      <div className="flex">
        <Avatar
          size="sm"
          radius="full"
          className="w-6 h-6 sm:w-8 sm:h-8"
          src={
            user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"
          }
        />
      </div>

      <div className="flex !w-full flex-col !bg-content2 rounded-md py-1 pt-2 max-w-[70%]">
        <TiptapEditor
          initialContent=""
          className="h-fit max-h-[400px] min-h-0 border-none !rounded-none p-0 px-5 !bg-content2  "
          containerClassName="!rounded-none shadow-none max-h-auto  !bg-content2 max-h-[400px] min-h-0 overflow-y-auto scrollbar-hide m"
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
      <Button
        size="sm"
        color="primary"
        radius="full"
        isLoading={isCreating || isUploading || isModerating}
        className="h-8 font-semibold px-5"
        onPress={handleSubmit}
      >
        Thêm bình luận
      </Button>
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

      {/* Add AlertAction cho confirm */}
      <AlertAction
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Nội dung có thể vi phạm quy định"
        description="Bình luận của bạn có thể chứa nội dung không phù hợp. Bạn vẫn muốn đăng (sẽ chờ duyệt)?"
        iconName="mdi:alert"
        confirmText="Vẫn đăng"
        cancelText="Hủy"
        isDanger={true}
        loading={isCreating}
      />
    </div>
  );
};

export default CommentCreation;
