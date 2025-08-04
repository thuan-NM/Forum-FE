"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  Tooltip,
  User,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { useGetUserInfo } from "../../../utils/getUserInfo";
import { GetAllTags } from "../../../services";
import { useUpdateAnswer } from "../../../hooks/answers/useUpdateAnswer";
import { useUploadImages } from "../../../hooks/attachments/useUploadAttachment";

import type {
  AnswerResponse,
  AnswerUpdateDto,
} from "../../../store/interfaces/answerInterfaces";
import type { TagResponse } from "../../../store/interfaces/tagInterfaces";

import TiptapEditor from "../../TextEditor/Tiptap";
import MenuBar from "../../TextEditor/MenuBar";
import EditorModal from "../../TextEditor/EditorModal";
import TagSelectionModal from "../../PostManage/Post/PostCreation/TagSelectionModal";

interface AnswerModalProps {
  answer?: AnswerResponse;
}

const AnswerEditModal: React.FC<AnswerModalProps> = ({ answer }) => {
  const [content, setContent] = useState<string>(answer?.content || "");
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState(false);
  const [openYoutube, setOpenYoutube] = useState(false);
  const [title, setTitle] = useState<string>(answer?.title || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const userData = useGetUserInfo();
  const { isOpen, onOpen, onClose: onTagClose } = useDisclosure();

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => GetAllTags({}),
  });

  const { updateAnswer, isUpdating } = useUpdateAnswer(() => {
    console.log("Answer updated successfully");
  });

  const { processContentWithUploads, isUploading } = useUploadImages();

  useEffect(() => {
    if (answer) {
      setTitle(answer.title || "");
      setContent(answer.content || "");
      setSelectedTags(answer.tags || []);
    }
  }, [answer]);

  const onSubmit = async (onCloseModal: () => void) => {
    try {
      const processedContent = await processContentWithUploads(content);
      const data: AnswerUpdateDto = {
        // questionId: answer?.question?.id || "",
        title: answer?.title || "",
        content: processedContent,
        tags: selectedTags.map((tag) => tag.id),
      };

      if (answer?.id) {
        updateAnswer({ id: answer.id, data });
      }

      onCloseModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật câu trả lời:", error);
    }
  };

  const handleTagSelection = (tags: TagResponse[]) => {
    setSelectedTags(tags);
  };

  return (
    <>
      <ModalContent className="flex flex-col h-[100vh]">
        {(onCloseModal) => (
          <>
            <div className="flex-0 sticky top-0 z-10">
              <div className="flex justify-between items-start pt-3">
                <Button
                  isIconOnly
                  className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full absolute left-0 top-0"
                  onPress={onCloseModal}
                >
                  <Icon icon="lucide:x" className="w-6 h-6" />
                </Button>
              </div>
            </div>

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
                      {userData?.fullName}
                    </p>
                  }
                  description={
                    <Button variant="bordered" size="sm" radius="full">
                      @{userData?.username}
                    </Button>
                  }
                />
              </div>
              <Input
                variant="underlined"
                className="!text-2xl mb-2"
                placeholder="Enter your post title"
                required
                value={title} // Đổ value initial
                onChange={(e) => setTitle(e.target.value)}
              />
              <TiptapEditor
                initialContent={content}
                onChange={setContent}
                isDisabled={false}
                className="min-h-[58vh] max-h-[58vh] overflow-y-auto scrollbar-hide"
                setEditor={setEditor}
                containerClassName="h-fit p-0 px-1 border-3 border-content3 !shadow-md rounded-lg !bg-content1"
              />
              <div className="flex flex-row gap-2 flex-wrap">
                {selectedTags.slice(0, 5).map((tag) => (
                  <Chip
                    key={tag.id}
                    onClose={() =>
                      setSelectedTags(
                        selectedTags.filter((t) => t.id !== tag.id)
                      )
                    }
                  >
                    {tag.name}
                  </Chip>
                ))}
                {selectedTags.length > 5 && (
                  <Tooltip
                    content={selectedTags
                      .slice(5)
                      .map((t) => t.name)
                      .join(", ")}
                    placement="top"
                  >
                    <Chip className="cursor-pointer" variant="bordered">
                      +{selectedTags.length - 5}
                    </Chip>
                  </Tooltip>
                )}
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
                <div className="flex flex-wrap gap-2 my-auto">
                  <Button
                    size="sm"
                    variant="bordered"
                    color="default"
                    onPress={onOpen}
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    Add Tags
                  </Button>
                </div>

                <Button
                  isLoading={isUpdating || isUploading} // ✅ thêm isUploading
                  color="primary"
                  size="sm"
                  onPress={() => onSubmit(onCloseModal)}
                  className="!px-6 !py-4"
                >
                  {answer ? "Cập nhật" : "Trả lời"}
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
              emojiClassName="left-1/2"
            />
          </>
        )}
      </ModalContent>

      <TagSelectionModal
        isOpen={isOpen}
        onClose={onTagClose}
        tags={tags?.tags || []}
        selectedTags={selectedTags}
        onTagSelection={handleTagSelection}
      />
    </>
  );
};

export default AnswerEditModal;
