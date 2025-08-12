import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import QuestionModal from "../../Question/QuestionCreation/QuestionModal";
import PostModal from "../../PostManage/Post/PostCreation/PostModal";
import { useState } from "react";

const HeaderModal = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [modalActive, setModalActive] = useState("Ask");

  const handleModalOpen = (modal: string) => {
    setModalActive(modal);
    onOpen();
  };
  return (
    <>
      <Tooltip content="Thêm câu hỏi" placement={"bottom"} offset={15}>
        <Button
          className="bg-red-500 font-semibold text-xs text-white"
          size="sm"
          onPress={() => handleModalOpen("Ask")}
        >
          Thêm câu hỏi
        </Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        size={"3xl"}
        onOpenChange={onOpenChange}
        className="rounded-md z-20"
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled={false}
      >
        {modalActive == "Ask" ? (
          <QuestionModal setModalActive={setModalActive} />
        ) : (
          <PostModal setModalActive={setModalActive} />
        )}
      </Modal>
    </>
  );
};

export default HeaderModal;
