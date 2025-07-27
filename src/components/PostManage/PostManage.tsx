import {
  Button,
  Divider,
  Input,
  Modal,
  useDisclosure,
  User,
} from "@heroui/react";
import { TbMessageQuestion } from "react-icons/tb";
import { BiMessageAltEdit } from "react-icons/bi";
import { GrEdit } from "react-icons/gr";
import { useState } from "react";
import PostModal from "./Post/PostCreation/PostModal";
import QuestionModal from "../Question/QuestionCreation/QuestionModal";
import { useGetUserInfo } from "../../utils/getUserInfo";

const PostManage = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [modalActive, setModalActive] = useState("Ask");
  const user = useGetUserInfo();
  const handleModalOpen = (modal: string) => {
    setModalActive(modal);
    onOpen();
  };

  return (
    <div className="w-full h-fit bg-content1 flex border border-transparent flex-col rounded-lg p-4 hover:border hover:border-content3">
      <div className="flex w-full">
        <User
          avatarProps={{
            src: user?.avatar
              ? user?.avatar
              : "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          description=""
          name=""
          className="mr-2"
        />
        <Input
          placeholder="What do you want to ask or share?"
          readOnly
          variant="bordered"
          disabled
        />
      </div>
      <div className="flex h-5 items-center space-x-2 text-small mt-3">
        <Button
          className="bg-content1 py-3 hover:bg-content2/30 w-full"
          size="sm"
          onPress={() => handleModalOpen("Ask")}
        >
          <TbMessageQuestion />
          Ask
        </Button>
        <Divider orientation="vertical" />
        <Button
          className="bg-content1 py-3 hover:bg-content2/30 w-full"
          size="sm"
        >
          <BiMessageAltEdit />
          Answer
        </Button>
        <Divider orientation="vertical" />
        <Button
          className="bg-content1 py-3 hover:bg-content2/30 w-full"
          size="sm"
          onPress={() => handleModalOpen("Post")}
        >
          <GrEdit />
          Post
        </Button>
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
      </div>
    </div>
  );
};

export default PostManage;
