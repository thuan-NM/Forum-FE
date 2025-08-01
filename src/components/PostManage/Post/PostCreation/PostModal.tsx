"use client"; // Thêm nếu cần, giả sử component này là client-side

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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppSelector } from "../../../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../../../store/store";
import { GetAllTags } from "../../../../services";
import { PostCreateDto } from "../../../../store/interfaces/postInterfaces";
import TiptapEditor from "../../../TextEditor/Tiptap";
import { AnimatePresence } from "framer-motion";
import MenuBar from "../../../TextEditor/MenuBar";
import EditorModal from "../../../TextEditor/EditorModal";
import TagSelectionModal from "./TagSelectionModal";
import { motion } from "framer-motion";
import { TagResponse } from "../../../../store/interfaces/tagInterfaces";
import { useCreatePost } from "../../../../hooks/posts/useCreatePost";
import { Upload } from "../../../../services/UploadServices";

// Hàm upload ảnh dựa trên logic từ AvatarUpload
async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await Upload(formData);
    if (!res || !res.attachment || !res.attachment.url) {
      throw new Error("Upload thất bại: Không có URL trả về");
    }
    return res.attachment.url;
  } catch (error) {
    console.error("Lỗi upload:", error);
    throw error; // Throw để handle ở trên
  }
}

interface PostModalProps {
  setModalActive: (arg0: string) => void;
}

const PostModal: React.FC<PostModalProps> = ({ setModalActive }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const userData = useAppSelector((state: RootState) => state.user.user);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => GetAllTags({}),
  });

  const { createPost, isCreating } = useCreatePost();

  // Hàm xử lý upload ảnh từ data URL trong content
  async function processContent(htmlContent: string): Promise<string> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgs = doc.querySelectorAll("img");
    const uploadPromises: Promise<void>[] = [];

    for (let img of Array.from(imgs)) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:")) {
        // Chuyển data URL thành Blob/File
        const blob = await fetch(src).then((r) => r.blob());
        const file = new File([blob], `image.${blob.type.split("/")[1]}`, {
          type: blob.type,
        });

        // Push promise upload và thay src
        uploadPromises.push(
          uploadImage(file)
            .then((url) => {
              img.setAttribute("src", url);
            })
            .catch((error) => {
              // Handle error: Ví dụ toast hoặc log
              console.error("Lỗi upload ảnh:", error);
              // Nếu muốn giữ data URL hoặc bỏ img, tùy chỉnh ở đây
            })
        );
      }
    }

    // Await tất cả upload song song
    await Promise.all(uploadPromises);

    // Trả về HTML đã cập nhật
    return doc.body.innerHTML;
  }

  const onSubmit = async (onClose: () => void) => {
    try {
      // Xử lý upload ảnh trước
      const processedContent = await processContent(content);

      const data: PostCreateDto = {
        content: processedContent,
        title,
        tags: selectedTags.map((tag) => tag.id),
      };

      createPost(data);
      onClose();
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      // Thêm toast nếu cần: toast.error("Có lỗi xảy ra khi đăng bài");
    }
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
                  Add Question
                </Button>
                <Button
                  className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out border-b-2 border-blue-400"
                  onPress={() => setModalActive("Post")}
                >
                  Create Post
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
                onChange={(e) => setTitle(e.target.value)}
              />
              <TiptapEditor
                initialContent=""
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
                isLoading={isCreating}
                color="primary"
                size="sm"
                onPress={() => onSubmit(onClose)}
                className="!px-6 !py-4"
              >
                Đăng bài
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
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
      <TagSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        tags={tags?.tags || []}
        selectedTags={selectedTags}
        onTagSelection={handleTagSelection}
      />
    </div>
  );
};

export default PostModal;
