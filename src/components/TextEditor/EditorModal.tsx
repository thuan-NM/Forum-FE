import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@heroui/react";
import React, { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../hooks/custom/outsideclick";
import { AnimatePresence, motion } from "framer-motion";
import { BiImageAdd, BiX } from "react-icons/bi";

interface EditorModalProp {
  setOpenImage: (value: boolean) => void;
  setOpenYoutube: (value: boolean) => void;
  editor: Editor | null;
  openImage: boolean;
  openYoutube: boolean;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
  emojiClassName?: string;
}

const EditorModal: React.FC<EditorModalProp> = ({
  emojiClassName,
  setOpenImage,
  setOpenYoutube,
  editor,
  openImage,
  openYoutube,
  showEmojiPicker,
  setShowEmojiPicker,
}) => {
  const [youtubeURL, setYoutubeURL] = useState<string>("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertEmoji = (emoji: any) => {
    editor?.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleInsertImages = () => {
    if (!editor) return;
    previews.forEach((preview, index) => {
      const file = fileInputRef.current?.files?.[index];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          // Fix: Insert dùng customImage thay vì setImage
          editor
            .chain()
            .focus()
            .insertContent({
              type: "customImage",
              attrs: { src: result, width: "300", height: "auto" },
            })
            .run();
        };
        reader.readAsDataURL(file);
      }
    });
    setOpenImage(false);
    setPreviews([]);
  };

  const handleRemovePreview = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const insertYoutubeVideo = () => {
    if (!editor || !youtubeURL) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeURL }).run();
    setOpenYoutube(false);
    setYoutubeURL("");
  };

  const emojiRef = useRef<HTMLDivElement>(null);
  useClickOutside(emojiRef, () => setShowEmojiPicker(false));

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div>
      <Modal
        isOpen={openImage}
        size="lg"
        onOpenChange={setOpenImage}
        closeButton
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Chèn ảnh</ModalHeader>
              <ModalBody className="grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      onPress={() => handleRemovePreview(index)}
                      className="absolute top-1 right-1"
                      variant="solid"
                      color="danger"
                      isIconOnly
                      size="sm"
                    >
                      <BiX />
                    </Button>
                  </div>
                ))}
                <Button
                  onPress={triggerFileInput}
                  variant="bordered"
                  className="h-32 flex items-center justify-center"
                >
                  <BiImageAdd className="text-4xl" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={() => setOpenImage(false)}>
                  Hủy
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onPress={handleInsertImages}
                  disabled={!previews.length}
                >
                  Chèn ({previews.length})
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={openYoutube}
        size="md"
        onOpenChange={setOpenYoutube}
        closeButton
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Chèn video YouTube</ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Nhập URL YouTube"
                  value={youtubeURL}
                  onChange={(e) => setYoutubeURL(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={() => setOpenYoutube(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onPress={insertYoutubeVideo}
                >
                  Chèn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="relative">
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              ref={emojiRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={cn("absolute top-10 right-20 z-[100]", emojiClassName)}
            >
              {/* ❗ Đừng animate Picker – để nó load thẳng */}
              <div className="will-change-auto">
                <Picker
                  data={data}
                  onEmojiSelect={insertEmoji}
                  theme="dark"
                  autoFocus={true} // Cho UX mượt hơn
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditorModal;
