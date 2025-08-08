"use client";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  User,
  Input,
  Chip,
  useDisclosure,
} from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import TiptapEditor from "../TextEditor/Tiptap";
import MenuBar from "../TextEditor/MenuBar";
import EditorModal from "../TextEditor/EditorModal";
import { QuestionResponse } from "../../store/interfaces/questionInterfaces";
import { useQuery } from "@tanstack/react-query";
import { AnswerCreateDto } from "../../store/interfaces/answerInterfaces";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { GetAllTags } from "../../services";
import { TagResponse } from "../../store/interfaces/tagInterfaces";
import TagSelectionModal from "../PostManage/Post/PostCreation/TagSelectionModal";
import { useCreateAnswer } from "../../hooks/answers/useCreateAnswer";
import { useUploadImages } from "../../hooks/attachments/useUploadAttachment";
import { useAutomaticModeration } from "../../hooks/automatic_moderations/useAutomaticModeration";
import AlertAction from "../Common/AlertAction";
import { stripHTML } from "../../utils/stripHTML";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  question: QuestionResponse;
}

const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  question,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const {
    isOpen: isOpenTag,
    onOpen: onOpenTag,
    onClose: onCloseTag,
  } = useDisclosure();
  const [title, setTitle] = useState<string>(question.title);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false); // State cho confirm modal
  const userData = useAppSelector((state: RootState) => state.user.user);
  const { createAnswer, isCreating } = useCreateAnswer();
  const { processContentWithUploads, isUploading } = useUploadImages();
  const { automaticModeration, isModerating } = useAutomaticModeration();

  const onSubmit = async (onClose: () => void) => {
    try {
      const processedContent = await processContentWithUploads(content);

      // Kiểm duyệt tự động trước
      const moderationResult = await automaticModeration(
        stripHTML(title + " " + content)
      );

      let data: AnswerCreateDto = {
        content: processedContent,
        questionId: question.id,
        tags: selectedTags.map((tag) => tag.id),
        title: title,
      };

      if (moderationResult.label === "hop_le") {
        // Giả sử "clean" nghĩa là không vi phạm
        data.status = "approved"; // Set approved nếu ok
        createAnswer(data, {
          onSuccess: () => {
            onClose();
          },
        });
      } else {
        // Vi phạm: Show confirm
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("Lỗi khi đăng câu trả lời:", error);
    }
  };

  const handleConfirm = (onClose: () => void) => {
    // User confirm vi phạm: Gửi mà không set status (backend default pending)
    const data: AnswerCreateDto = {
      content: content, // Đã processed
      questionId: question.id,
      tags: selectedTags.map((tag) => tag.id),
      title: title,
      // Không set status
    };
    createAnswer(data, {
      onSuccess: () => {
        onClose();
      },
    });
    setShowConfirm(false);
  };

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => GetAllTags({}),
  });

  const handleTagSelection = (tags: TagResponse[]) => {
    setSelectedTags(tags);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      backdrop="blur"
      hideCloseButton
      className="rounded-md z-20 max-h-[100vg] !my-0"
      isKeyboardDismissDisabled={false}
      size="3xl"
    >
      <ModalContent className="flex flex-col h-[100vh]">
        {(onClose) => (
          <>
            {/* Header */}
            <div className="flex-0 sticky top-0 z-10">
              <div className="flex justify-center relative pt-3">
                <Button
                  isIconOnly
                  className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full absolute left-0 top-0"
                  onPress={onClose}
                >
                  <Icon icon="lucide:x" className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <ModalBody className="flex-1 overflow-y-auto mt-8">
              <div className="flex justify-start mb-1">
                <User
                  avatarProps={{
                    src:
                      userData?.avatar ||
                      "https://img.heroui.chat/image/avatar?w=300&h=300&u=1",
                  }}
                  name={
                    <p className="text-xs font-semibold mb-1">
                      {userData?.fullName || "Ẩn danh"}
                    </p>
                  }
                  description={
                    <Button variant="bordered" size="sm" radius="full">
                      @{userData?.username || "người dùng"}
                    </Button>
                  }
                />
              </div>
              <Input
                variant="underlined"
                className="!text-2xl mb-2"
                placeholder="Nhập tiêu đề câu trả lời"
                required
                defaultValue={question.title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TiptapEditor
                initialContent=""
                onChange={setContent}
                isDisabled={false}
                setEditor={setEditor}
                className="min-h-[58vh] max-h-[58vh] overflow-y-auto scrollbar-hide"
                containerClassName="h-fit p-0 px-1 border-3 border-content3 !shadow-md rounded-lg !bg-content1"
              />
              <div className="flex flex-row gap-x-2">
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    onClose={() =>
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                  >
                    {tag.name}
                  </Chip>
                ))}
              </div>
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex justify-between items-center">
              <div className="flex items-center">
                <motion.div
                  onClick={() => setIsVisible(!isVisible)}
                  whileTap={{ y: 1 }}
                  className="mr-3"
                >
                  {isVisible ? (
                    <Button
                      className="!text-base !p-1"
                      size="sm"
                      onPress={() => setIsVisible(!isVisible)}
                      variant="flat"
                      isIconOnly
                    >
                      <Icon icon="lucide:x" />
                    </Button>
                  ) : (
                    <Button
                      className="!text-base !px-1"
                      size="sm"
                      onPress={() => setIsVisible(!isVisible)}
                      variant="bordered"
                      isIconOnly
                    >
                      <Icon icon="lucide:edit" />
                    </Button>
                  )}
                </motion.div>
                <AnimatePresence initial={false}>
                  {isVisible && editor && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                    >
                      <MenuBar
                        editor={editor}
                        onAddImage={() => setOpenImage(true)}
                        onAddYoutube={() => setOpenYoutube(true)}
                        include={[
                          "bold",
                          "italic",
                          "strike",
                          "underline",
                          "code",
                          "h1",
                          "emoji",
                          "bulletList",
                          "orderedList",
                          "blockquote",
                          "link",
                          "image",
                        ]}
                        setShowEmojiPicker={() =>
                          setShowEmojiPicker(!showEmojiPicker)
                        }
                        className="flex-nowrap"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    size="sm"
                    variant="bordered"
                    color="default"
                    onPress={onOpenTag}
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    Add Tags
                  </Button>
                </div>

                <Button
                  isLoading={isCreating || isUploading || isModerating}
                  color="primary"
                  size="sm"
                  onPress={() => onSubmit(onClose)}
                  className="!px-6 !py-4"
                >
                  Trả lời
                </Button>
              </div>
            </ModalFooter>

            {/* Modals */}
            <EditorModal
              editor={editor}
              setOpenImage={setOpenImage}
              setOpenYoutube={setOpenYoutube}
              openImage={openImage}
              openYoutube={openYoutube}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
            />
          </>
        )}
      </ModalContent>
      <TagSelectionModal
        isOpen={isOpenTag}
        onClose={onCloseTag}
        tags={tags?.tags || []}
        selectedTags={selectedTags}
        onTagSelection={handleTagSelection}
      />

      {/* Add AlertAction cho confirm */}
      <AlertAction
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleConfirm(onClose)}
        title="Nội dung có thể vi phạm quy định"
        description="Câu trả lời của bạn có thể chứa nội dung không phù hợp. Bạn vẫn muốn đăng (sẽ chờ duyệt)?"
        iconName="mdi:alert"
        confirmText="Vẫn đăng"
        cancelText="Hủy"
        isDanger={true}
        loading={isCreating}
      />
    </Modal>
  );
};

export default AnswerModal;
