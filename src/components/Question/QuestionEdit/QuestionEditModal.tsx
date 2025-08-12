import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { FaCaretRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { MdClear } from "react-icons/md";
import { TopicResponse } from "../../../store/interfaces/topicInterfaces";
import { useQuery } from "@tanstack/react-query";
import { GetFollowedTopics } from "../../../services";
import { Icon } from "@iconify/react";
import { useGetUserInfo } from "../../../utils/getUserInfo";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Input } from "@heroui/react";
import { useUploadImages } from "../../../hooks/attachments/useUploadAttachment";
import TiptapEditor from "../../TextEditor/Tiptap";
import MenuBar from "../../TextEditor/MenuBar";
import EditorModal from "../../TextEditor/EditorModal";
import { useUpdateQuestion } from "../../../hooks/questions/useUpdateQuestion";
import {
  QuestionResponse,
  QuestionUpdateDto,
} from "../../../store/interfaces/questionInterfaces";
import TopicSelectionModal from "../QuestionCreation/TopicSelectionModal";

interface QuestionEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionResponse;
}

const QuestionEditModal: React.FC<QuestionEditModalProps> = ({
  isOpen,
  onOpenChange,
  question,
}) => {
  const [title, setTitle] = useState<string>(question.title);
  const [content, setContent] = useState<string>(question.description);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(
    null
  );
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const user = useGetUserInfo();
  const { updateQuestion, isUpdating } = useUpdateQuestion();
  const { processContentWithUploads, isUploading } = useUploadImages();

  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: () => GetFollowedTopics(),
  });

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setContent(question.description || "");
      setSelectedTopic(question && question.topic);
    }
  }, [question]);

  const onSubmit = async (onClose: () => void) => {
    if (!selectedTopic?.id) return;
    try {
      const processedContent = await processContentWithUploads(content);
      const data: QuestionUpdateDto = {
        title,
        description: processedContent,
        topicId: Number(selectedTopic.id),
      };
      updateQuestion(
        {
          id: question.id,
          data,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật câu hỏi:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      className="rounded-md z-20 max-h-[100vg] !my-0"
      backdrop="blur"
      hideCloseButton
      isKeyboardDismissDisabled={false}
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <Button
              isIconOnly
              className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full"
              onPress={onClose}
            >
              <MdClear className="w-7 h-7" />
            </Button>
            <ModalHeader className="flex flex-col gap-1 pt-1">
              <div className="flex justify-between border-b-2 border-content3">
                <Button
                  className="bg-transparent w-full rounded-none text-base font-semibold transition duration-300 ease-in-out border-b-2 border-blue-400"
                  disabled
                >
                  Sửa câu hỏi
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="flex-1">
              <div className="bg-content2 rounded-sm backdrop-opacity-60 p-4">
                <p className="font-bold">Mẹo để nhận được câu trả lời tốt</p>
                <ul className="list-disc list-inside font-light">
                  <li>Đảm bảo câu hỏi của bạn chưa từng được hỏi</li>
                  <li>Giữ câu hỏi ngắn gọn, rõ ràng</li>
                  <li>Kiểm tra lỗi chính tả và ngữ pháp</li>
                </ul>
              </div>
              <div className="pt-2">
                <div className="flex items-center">
                  <Avatar
                    className="w-6 h-6 text-tiny mr-1"
                    src={
                      user?.avatar
                        ? user.avatar
                        : "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                    }
                  />
                  <FaCaretRight className="mr-1" />
                  <Button
                    variant="bordered"
                    radius="full"
                    className="px-2 py-0 text-sm text-black/80 dark:text-white/80"
                    onPress={() => setIsTopicModalOpen(true)}
                    size="sm"
                  >
                    <Icon icon="material-symbols:book-3" className="w-5 h-5" />
                    {selectedTopic ? selectedTopic.name : "Chọn chủ đề"}
                    <FaAngleDown />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col w-full gap-y-4 mt-2">
                <Input
                  variant="underlined"
                  className="!text-2xl"
                  placeholder="Bắt đầu với: Cái gì?, Tại sao?, Như thế nào?..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TiptapEditor
                  initialContent={content}
                  onChange={setContent}
                  isDisabled={false}
                  setEditor={setEditor}
                  className="min-h-[35vh] max-h-[35vh] overflow-y-auto scrollbar-"
                  containerClassName="h-fit p-0 px-1 border-3 border-content3 !shadow-md rounded-lg !bg-content1"
                />
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between items-center">
              <div className="flex items-center overflow-x-scroll scrollbar-hide flex-nowrap">
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
                <Button
                  className="border-none bg-transparent hover:bg-content2 px-0"
                  radius="full"
                  size="sm"
                  onPress={onClose}
                >
                  Hủy
                </Button>
                <Button
                  color="primary"
                  radius="full"
                  className="px-5"
                  size="sm"
                  isLoading={isUpdating || isUploading}
                  onPress={() => onSubmit(onClose)}
                >
                  Cập nhật câu hỏi
                </Button>
              </div>
            </ModalFooter>
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
      <TopicSelectionModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        topics={topics || []}
        selectedTopic={selectedTopic}
        onTopicSelect={(topic) => setSelectedTopic(topic)}
      />
    </Modal>
  );
};

export default QuestionEditModal;
