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
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AnswerCreateDto } from "../../store/interfaces/answerInterfaces";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { GetAllTags } from "../../services";
import { TagResponse } from "../../store/interfaces/tagInterfaces";
import TagSelectionModal from "../PostManage/Post/PostCreation/TagSelectionModal";
import { useCreateAnswer } from "../../hooks/answers/useCreateAnswer";

interface AnswerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionResponse;
}

const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
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
  const userData = useAppSelector((state: RootState) => state.user.user);
  const { createAnswer, isCreating } = useCreateAnswer();

  const onSubmit = (onClose: () => void) => {
    const data: AnswerCreateDto = {
      content: content,
      questionId: question.id,
      tags: selectedTags.map((tag) => tag.id),
      title: title,
    };
    createAnswer(data, {
      onSuccess: () => {
        onClose();
      },
    });
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
            <ModalBody className="flex-1 overflow-y-auto mt-8  scrollbar-hide">
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
                onChange={(value) => setContent(value)}
                isDisabled={false}
                setEditor={setEditor}
              />
            </ModalBody>
            <div className="flex flex-wrap gap-2 px-6 py-2">
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
              <Button
                size="sm"
                variant="bordered"
                color="default"
                onPress={onOpenTag}
                startContent={<Icon icon="lucide:plus" />}
              >
                Thêm thẻ
              </Button>
            </div>
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
                  {isVisible && editor ? (
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
                          "h2",
                          "h3",
                          "emoji",
                          "youtube",
                          "bulletList",
                          "orderedList",
                          "blockquote",
                          "link",
                          "image",
                        ]}
                        setShowEmojiPicker={() =>
                          setShowEmojiPicker(!showEmojiPicker)
                        }
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              <Button
                color="primary"
                size="sm"
                onPress={() => onSubmit(onClose)}
                isLoading={isCreating}
                className="!px-6 !py-4"
              >
                Trả lời
              </Button>
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
    </Modal>
  );
};

export default AnswerModal;