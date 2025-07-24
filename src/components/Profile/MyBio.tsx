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
  Card,
} from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import TiptapEditor from "../TextEditor/Tiptap";
import MenuBar from "../TextEditor/MenuBar";
import EditorModal from "../TextEditor/EditorModal";
import { UserResponse } from "../../store/interfaces/userInterfaces";
import { useUpdateUser } from "../../hooks/users/useEditUser";
import toast from "react-hot-toast";

interface MyBioProps {
  user: UserResponse;
}

const MyBio: React.FC<MyBioProps> = ({ user }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [bio, setBio] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const { UpdateUser, isUpdating } = useUpdateUser(() => {
    toast.success("Cập nhật mô tả thành công!");
    // setUser
    onClose();
  });

  const onSubmit = () => {
    if (!bio || !bio.trim()) {
      toast.error("Mô tả không được để trống");
      return;
    }

    UpdateUser(user?.id, { bio });
  };
  return (
    <>
      <Card className="rounded-md">
        <div className="flex justify-center flex-col my-2 gap-y-1 mx-auto py-6 px-2 items-center">
          {/* <BsMailbox className="w-10 h-10 opacity-60 mx-auto" /> */}
          <div className="mx-auto font-bold text-sm opacity-60">
            <div>Thêm mô tả về bản thân của bạn tại đây</div>
          </div>

          <Button
            color="primary"
            radius="full"
            className="w-fit mx-auto mt-4 font-semibold"
            variant="bordered"
            onPress={onOpen}
          >
            Thêm mô tả
          </Button>
        </div>
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
            <ModalBody className="flex-1 overflow-y-auto mt-8 h-fit scrollbar-hide">
              <TiptapEditor
                initialContent=""
                onChange={(value) => setBio(value)}
                isDisabled={false}
                setEditor={setEditor}
              />
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
                onPress={() => onSubmit()}
                isLoading={isUpdating}
                className="!px-6 !py-4"
              >
                Thêm
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
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyBio;
