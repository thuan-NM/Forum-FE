import React, { useState, useEffect } from "react"; // Thêm useEffect để đổ dữ liệu initial
import {
  Button,
  Chip,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  User,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppSelector } from "../../../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../../../store/store";
import { GetAllTags } from "../../../../services";
import {
  PostCreateDto,
  PostResponse,
} from "../../../../store/interfaces/postInterfaces"; // Thêm PostResponse
import TiptapEditor from "../../../TextEditor/Tiptap";
import { AnimatePresence } from "framer-motion";
import MenuBar from "../../../TextEditor/MenuBar";
import EditorModal from "../../../TextEditor/EditorModal";
import TagSelectionModal from "../PostCreation/TagSelectionModal";
import { motion } from "framer-motion";
import { TagResponse } from "../../../../store/interfaces/tagInterfaces";
import { useUpdatePost } from "../../../../hooks/posts/useUpdatePost";
import { useGetUserInfo } from "../../../../utils/getUserInfo";
import { useUploadImages } from "../../../../hooks/attachments/useUploadAttachment";

interface PostModalProps {
  post?: PostResponse; // Thêm prop post optional cho edit
}

const PostEditModal: React.FC<PostModalProps> = ({ post }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [content, setContent] = useState<string>(post?.content || "");
  const [title, setTitle] = useState<string>(post?.title || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const userData = useGetUserInfo();
  const { isOpen, onOpen, onClose: onTagClose } = useDisclosure(); // Đổi tên để tránh conflict

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => GetAllTags({}),
  });

  const { updatePost, isUpdating } = useUpdatePost(); // Thêm hook update

  // Đổ dữ liệu initial nếu là edit (có post)
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setSelectedTags(post.tags || []);
    }
  }, [post]);

  const { processContentWithUploads, isUploading } = useUploadImages();

  const onSubmit = async (onCloseModal: () => void) => {
    try {
      const processedContent = await processContentWithUploads(content); // 👈 xử lý ảnh
      const data: PostCreateDto = {
        content: processedContent,
        title,
        tags: selectedTags.map((tag) => tag.id),
      };
      if (post?.id) {
        updatePost({ id: post.id, data });
      }
      onCloseModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
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
              <div className="flex justify-center relative pt-3">
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
                initialContent={content} // Đổ initialContent từ post.content
                onChange={(value) => {
                  setContent(value);
                }}
                className="min-h-[58vh] max-h-[58vh] overflow-y-auto scrollbar-hide"
                isDisabled={false}
                setEditor={setEditor}
                containerClassName="h-fit p-0 px-1 border-3 border-content3 !shadow-md rounded-lg !bg-content1"
              />
              {/* Tag display section with +n */}
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
                  {post ? "Cập nhật" : "Đăng bài"}
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

export default PostEditModal;
