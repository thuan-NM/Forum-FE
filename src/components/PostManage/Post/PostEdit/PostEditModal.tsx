import React, { useState, useEffect } from "react"; // Thêm useEffect để đổ dữ liệu initial
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

interface PostModalProps {
  post?: PostResponse; // Thêm prop post optional cho edit
}

const PostEditModal: React.FC<PostModalProps> = ({ post }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [content, setContent] = useState<string>(post?.content || "");
  const [title, setTitle] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const userData = useAppSelector((state: RootState) => state.user.user);
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

  const onSubmit = (onCloseModal: () => void) => {
    const data: PostCreateDto = {
      content,
      title,
      tags: selectedTags.map((tag) => tag.id),
    };
    if (post?.id) {
      updatePost({ id: post.id, data: data }); // ✅ đúng cấu trúc truyền vào mutation
    }

    onCloseModal();
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
              <div className="flex justify-center relative py-1.5">
                <Button
                  isIconOnly
                  className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full absolute left-0 top-0"
                  onPress={onCloseModal}
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
                onPress={onOpen}
                startContent={<Icon icon="lucide:plus" />}
              >
                Add Tags
              </Button>
            </div>
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
                isLoading={isUpdating} // Loading cho cả create và update
                color="primary"
                size="sm"
                onPress={() => onSubmit(onCloseModal)}
                className="!px-6 !py-4"
              >
                {post ? "Cập nhật" : "Đăng bài"}{" "}
                {/* Thay đổi text button nếu edit */}
              </Button>
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
