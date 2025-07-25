import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
// Thư viện Emoji Mart v5+
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../hooks/custom/outsideclick";
import { AnimatePresence, motion } from "framer-motion";

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

  // Hàm chèn emoji
  const insertEmoji = (emoji: any) => {
    if (editor) {
      // emoji.native là ký tự emoji
      editor.chain().focus().insertContent(emoji.native).run();
    }
    setShowEmojiPicker(false); // đóng popup sau khi chọn
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result && typeof result === "string") {
        // Chèn ảnh vào editor
        editor.chain().focus().setImage({ src: result }).run();
        setOpenImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const insertYoutubeVideo = () => {
    if (!editor || !youtubeURL) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeURL }).run();
    setOpenYoutube(false);
    setYoutubeURL("");
  };
  const emojiRef = useRef<HTMLDivElement>(null);

  useClickOutside(emojiRef, () => {
    if (showEmojiPicker) setShowEmojiPicker(false);
  });
  return (
    <div>
      {/* ========== Modal chèn ảnh (cùng cấp) ========== */}
      <Modal
        isOpen={openImage}
        size="md"
        onOpenChange={setOpenImage}
        closeButton
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h3 className="text-lg font-semibold">Chọn ảnh từ máy</h3>
              </ModalHeader>
              <ModalBody>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full mb-3"
                />
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button variant="bordered" onPress={() => setOpenImage(false)}>
                  Hủy
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ========== Modal chèn YouTube (cùng cấp) ========== */}
      <Modal
        isOpen={openYoutube}
        size="md"
        onOpenChange={setOpenYoutube}
        closeButton
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h3 className="text-lg font-semibold">Chèn video YouTube</h3>
              </ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  placeholder="Nhập URL YouTube"
                  value={youtubeURL}
                  onChange={(e) => setYoutubeURL(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </ModalBody>
              <ModalFooter className="flex justify-end gap-2">
                <Button
                  variant="bordered"
                  onPress={() => setOpenYoutube(false)}
                >
                  Hủy
                </Button>
                <Button variant="bordered" onPress={insertYoutubeVideo}>
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
              className={cn("absolute top-10 right-20 z-[20]", emojiClassName)}
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
