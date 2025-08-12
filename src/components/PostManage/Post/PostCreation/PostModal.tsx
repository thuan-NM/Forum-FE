"use client";

import React, { useState } from "react";
import {
  Button,
  Chip,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
  useDisclosure,
  Tooltip,
} from "@heroui/react"; // 👈 đảm bảo đã import Tooltip
import { Icon } from "@iconify/react";
import { useAppSelector } from "../../../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../../../store/store";
import { GetAllTags } from "../../../../services";
import { PostCreateDto } from "../../../../store/interfaces/postInterfaces";
import TiptapEditor from "../../../TextEditor/Tiptap";
import { AnimatePresence, motion } from "framer-motion";
import MenuBar from "../../../TextEditor/MenuBar";
import EditorModal from "../../../TextEditor/EditorModal";
import TagSelectionModal from "./TagSelectionModal";
import { TagResponse } from "../../../../store/interfaces/tagInterfaces";
import { useCreatePost } from "../../../../hooks/posts/useCreatePost";
import { useUploadImages } from "../../../../hooks/attachments/useUploadAttachment";
import AlertAction from "../../../Common/AlertAction";
import { useAutomaticModeration } from "../../../../hooks/automatic_moderations/useAutomaticModeration";
import { stripHTML } from "../../../../utils/stripHTML";

interface PostModalProps {
  setModalActive: (arg0: string) => void;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ setModalActive, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const userData = useAppSelector((state: RootState) => state.user.user);
  const {
    isOpen: isOpenTag,
    onOpen: onOpenTag,
    onClose: onCloseTag,
  } = useDisclosure();
  const [showConfirm, setShowConfirm] = useState<boolean>(false); // State cho confirm modal
  const { automaticModeration, isModerating } = useAutomaticModeration();
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => GetAllTags({}),
  });

  const { createPost, isCreating } = useCreatePost();
  const { processContentWithUploads, isUploading } = useUploadImages();

  const onSubmit = async (onClose: () => void) => {
    try {
      const processedContent = await processContentWithUploads(content);

      // Kiểm duyệt tự động trước
      const moderationResult = await automaticModeration(
        stripHTML(title + " " + processedContent)
      );

      let data: PostCreateDto = {
        content: processedContent,
        title,
        tags: selectedTags.map((tag) => tag.id),
      };

      if (moderationResult.label === "hop_le") {
        // Giả sử "clean" nghĩa là không vi phạm
        data.status = "approved"; // Set approved nếu ok
        createPost(data);
        onClose();
      } else {
        // Vi phạm: Show confirm
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("Lỗi khi submit:", error);
    }
  };

  const handleConfirm = async (onClose: () => void) => {
    // User confirm vi phạm: Gửi mà không set status (backend default pending)
    const processedContent = await processContentWithUploads(content);

    const data: PostCreateDto = {
      content: processedContent, // Đã processed
      title,
      tags: selectedTags.map((tag) => tag.id),
      // Không set status
    };
    createPost(data);
    setShowConfirm(false);
    onClose();
  };

  const handleTagSelection = (tags: TagResponse[]) => {
    setSelectedTags(tags);
  };

  return (
    <div>
      <ModalContent className="flex flex-col h-[100vh]">
        {(onClose) => (
          <>
            <div className="flex-0 sticky top-0 z-10">
              <div className="flex justify-center relative pt-3">
                <Button
                  isIconOnly
                  className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full absolute left-0 top-0"
                  onPress={onClose}
                >
                  <Icon icon="lucide:x" className="w-6 h-6" />
                </Button>

                <Button
                  className="bg-content2 rounded-full"
                  variant="flat"
                  size="sm"
                >
                  <div className="flex !items-center gap-2 text-xs font-semibold">
                    <Icon icon="lucide:globe" className="text-lg" /> Everyone
                  </div>
                </Button>
              </div>
            </div>

            <ModalHeader className="flex flex-col gap-1 pt-1 relative">
              <div className="flex justify-between border-b-2 border-content3">
                <Button
                  className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out"
                  onPress={() => setModalActive("Ask")}
                >
                  Đặt câu hỏi
                </Button>
                <Button
                  className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out border-b-2 border-blue-400"
                  onPress={() => setModalActive("Post")}
                >
                  Đăng bài
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="flex-1 overflow-y-auto">
              <div className="flex justify-start">
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
                    <Button
                      variant="bordered"
                      size="sm"
                      radius="full"
                      className="h-6 w-full"
                    >
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
                onChange={(e) => setTitle(e.target.value)}
              />

              <TiptapEditor
                initialContent=""
                onChange={setContent}
                isDisabled={false}
                setEditor={setEditor}
                className="min-h-[48vh] max-h-[48vh] overflow-y-auto scrollbar-hide"
                containerClassName="h-fit p-0 px-1 border-3 border-content3 !shadow-md rounded-lg !bg-content1"
              />

              {/* Tag display section with +n */}
              <div className="flex flex-row gap-2 flex-wrap mt-2">
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
                  Đăng bài
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <AlertAction
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleConfirm(onClose)}
        title="Nội dung có thể vi phạm quy định"
        description="Bài viết của bạn có thể chứa nội dung không phù hợp. Bạn vẫn muốn đăng (sẽ chờ duyệt)?"
        iconName="mdi:alert"
        confirmText="Vẫn đăng"
        cancelText="Hủy"
        isDanger={true}
        loading={isCreating}
      />
      <EditorModal
        editor={editor}
        setOpenImage={setOpenImage}
        setOpenYoutube={setOpenYoutube}
        openImage={openImage}
        openYoutube={openYoutube}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        emojiClassName="left-1/2 bottom-10"
      />

      <TagSelectionModal
        isOpen={isOpenTag}
        onClose={onCloseTag}
        tags={tags?.tags || []}
        selectedTags={selectedTags}
        onTagSelection={handleTagSelection}
      />
    </div>
  );
};

export default PostModal;
