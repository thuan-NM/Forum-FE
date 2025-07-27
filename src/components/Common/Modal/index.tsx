import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import AIChatModal from "./ChatBotModal";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

const AIChat: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-purple-300 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Tooltip content="Chat with AI Assistant" placement="left">
          <Button
            color="primary"
            onPress={onOpen}
            className="font-semibold text-lg p-4 size-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500"
            isIconOnly
          >
            <Icon icon="lucide:bot" width={24} className="text-white" />
          </Button>
        </Tooltip>
      </motion.div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "full" : "lg"}
        classNames={{
          base: "bg-transparent",
          wrapper: "bg-transparent",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0 overflow-hidden">
              <AIChatModal onClose={onClose} isMobile={isMobile} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AIChat;
