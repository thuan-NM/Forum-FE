import {
  Button,
  Modal,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import QuestionModal from "../../Question/QuestionCreation/QuestionModal";
import PostModal from "../../PostManage/Post/PostCreation/PostModal";
import { useState } from "react";

const HeaderModal = () => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [modalActive, setModalActive] = useState("Ask");

  const handleModalOpen = (modal: string) => {
    setModalActive(modal);
    onOpen();
  };
  return (
    <>
      <Tooltip content="Add Question" placement={"bottom"} offset={15}>
        <Button
          className="bg-red-500 font-semibold text-xs text-white"
          size="sm"
          onPress={() => handleModalOpen("Ask")}
        >
          Add Question
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
          <QuestionModal setModalActive={setModalActive} onClose={onClose} />
        ) : (
          <PostModal setModalActive={setModalActive} onClose={onClose} />
        )}
      </Modal>
    </>
  );
};

export default HeaderModal;
