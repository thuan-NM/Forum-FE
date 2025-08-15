"use client";
import DOMPurify from "dompurify";
import { CiEdit } from "react-icons/ci";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
} from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TiptapEditor from "../TextEditor/Tiptap";
import MenuBar from "../TextEditor/MenuBar";
import EditorModal from "../TextEditor/EditorModal";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import toast from "react-hot-toast";
import {  useQueryClient } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import { useUpdateUser } from "../../hooks/users/useEditUser";
import { useUploadImages } from "../../hooks/attachments/useUploadAttachment";

interface MyBioProps {
  user: UserResponse;
  isMe?: boolean;
}

const MAX_LINES = 6;
const LINE_HEIGHT_PX = 24;

const MyBio: React.FC<MyBioProps> = ({ user, isMe = true }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [bio, setBio] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [textContent, setTextContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const { processContentWithUploads, isUploading } = useUploadImages();

  const { UpdateUser, isUpdating } = useUpdateUser(() => {
    queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    onClose();
  });
  const onSubmit = async () => {
    if (!bio || !bio.trim()) {
      toast.error("Mô tả không được để trống");
      return;
    }
    try {
      const processedBio = await processContentWithUploads(bio);
      await UpdateUser(user.id, { bio: processedBio });
    } catch (error) {
      console.error("Lỗi xử lý ảnh trong bio:", error);
    }
  };

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(user?.bio || "", "text/html");
    const imgElements = doc.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    const cleanText = DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_TAGS: ["ol", "ul", "li"],
    });
    setTextContent(cleanText);
  }, [user?.bio]);

  useEffect(() => {
    if (contentRef.current) {
      const maxHeight = MAX_LINES * LINE_HEIGHT_PX;
      requestAnimationFrame(() => {
        const scrollHeight = contentRef.current?.scrollHeight || 0;
        setIsOverflowing(scrollHeight > maxHeight);
      });
    }
  }, [textContent]);

  const cleanContent = DOMPurify.sanitize(user?.bio || "", {
    ADD_TAGS: ["ol", "ul", "li"],
  });

  // ✅ Khi mở modal, đổ bio hiện tại vào editor
  const handleOpen = () => {
    setBio(user?.bio || "");
    onOpen();
  };

  return (
    <>
      <Card className="rounded-md">
        {user?.bio ? (
          <div className="p-6 relative">
            {isMe && (
              <Button
                color="default"
                radius="full"
                className="w-fit mx-auto my-2 font-semibold absolute top-2 right-2"
                size="sm"
                isIconOnly
                variant="light"
                onPress={handleOpen}
              >
                <CiEdit className="size-4" />
              </Button>
            )}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={cn(
                `leading-[${LINE_HEIGHT_PX}px] bg-content1 mt-2 prose !max-w-full dark:!text-white !text-black dark:prose-invert${
                  !expanded && isOverflowing ? "overflow-hidden" : ""
                }`
              )}
              style={{
                maxHeight:
                  !expanded && isOverflowing
                    ? `${MAX_LINES * LINE_HEIGHT_PX}px`
                    : "none",
              }}
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
                  {expanded ? "Less" : "More"}
                </motion.button>
              </div>
            )}
          </div>
        ) : isMe ? (
          <div className="flex justify-center flex-col my-2 gap-y-1 mx-auto py-6 px-2 items-center">
            <div className="mx-auto font-bold text-sm opacity-60">
              <div>Thêm mô tả về bản thân của bạn tại đây</div>
            </div>

            <Button
              color="primary"
              radius="full"
              className="w-fit mx-auto mt-4 font-semibold"
              variant="bordered"
              onPress={handleOpen}
            >
              Thêm mô tả
            </Button>
          </div>
        ) : (
          <div className="flex justify-center flex-col my-2 gap-y-1 mx-auto py-6 px-2 items-center">
            <div className="mx-auto font-medium text-sm opacity-60">
              Người dùng này chưa có mô tả
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled={false}
        size="3xl"
      >
        <ModalContent className="flex flex-col h-fit">
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
              </div>
            </div>

            <ModalBody className="flex-1 overflow-y-auto mt-8 h-fit scrollbar-hide">
              <TiptapEditor
                initialContent={bio} // ✅ truyền bio hiện tại vào đây
                onChange={(value) => setBio(value)}
                isDisabled={false}
                setEditor={setEditor}
                className="max-h-[65vh] overflow-y-auto scrollbar-hide w-full"
              />
            </ModalBody>

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
                onPress={onSubmit}
                isLoading={isUpdating || isUploading}
                className="!px-6 !py-4"
              >
                Thêm
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
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyBio;
