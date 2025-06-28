import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  User,
} from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { MdClear } from "react-icons/md";
import { SlClose } from "react-icons/sl";
import { TiEdit } from "react-icons/ti";
import { motion } from "framer-motion";
import { useState } from "react";
import TiptapEditor from "../../../TextEditor/Tiptap";
import MenuBar from "../../../TextEditor/MenuBar";
import EditorModal from "../../../TextEditor/EditorModal";
import { QuestionResponse } from "../../../../store/interfaces/questionInterfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAnswer } from "../../../../services/AnswerServices";
import toast from "react-hot-toast";
import { AnswerCreateDto } from "../../../../store/interfaces/answerInterfaces";

interface AnswerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionResponse;
}

interface MutationContext {
  previousQuestions: QuestionResponse[] | undefined;
}

const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onOpenChange,
  question,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [editor, setEditor] = useState<any>(null);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [openYoutube, setOpenYoutube] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, AnswerCreateDto, MutationContext>({
    mutationFn: CreateAnswer,
    onMutate: async (data: AnswerCreateDto) => {
      await queryClient.cancelQueries({ queryKey: ["questions"] });

      const previousQuestions = queryClient.getQueryData<QuestionResponse[]>([
        "questions",
      ]);

      // Optimistic update cho answerCount
      queryClient.setQueryData<QuestionResponse[]>(["questions"], (old) =>
        old?.map((q) =>
          q.id === data.questionId
            ? { ...q, answerCount: q.answersCount + 1 }
            : q
        )
      );

      return { previousQuestions };
    },
    onError: (error: any, _data, context) => {
      if (context) {
        queryClient.setQueryData(["questions"], context.previousQuestions);
      }
      toast.error(error.response?.data?.error || "Failed to post answer");
    },
    onSuccess: () => {
      toast.success("Answer posted successfully");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["answers", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const onSubmit = (onClose: () => void) => {
    const data: AnswerCreateDto = {
      content: content,
      questionId: question.id,
    };
    mutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        backdrop="blur"
        hideCloseButton
        isKeyboardDismissDisabled={false}
        size="3xl"
      >
        <ModalContent className="flex flex-col h-[80vh] max-h-[78vh]">
          {(onClose) => (
            <>
              <div className="flex-0 sticky top-0 z-10">
                <div className="flex justify-center relative pt-3">
                  <Button
                    isIconOnly
                    className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full absolute left-0 top-0"
                    onPress={onClose}
                  >
                    <MdClear className="w-7 h-7" />
                  </Button>
                </div>
              </div>
              <ModalBody className="flex-1 overflow-y-auto max-h-[calc(80vh-150px)] mt-10">
                <div className="flex justify-start">
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    }}
                    name={
                      <p className="text-xs font-semibold mb-1">
                        Nguyen Minh Thuan
                      </p>
                    }
                    description={
                      <Button variant="bordered" size="sm" radius="full">
                        Knows Vietnamese
                      </Button>
                    }
                  />
                </div>
                <div className="text-md font-bold">{question.title}</div>
                <TiptapEditor
                  initialContent=""
                  onChange={(value) => setContent(value)}
                  isDisabled={false}
                  setEditor={setEditor}
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
                        className="text-2xl !p-1"
                        size="sm"
                        onPress={() => setIsVisible(!isVisible)}
                        variant="flat"
                        isIconOnly
                      >
                        <SlClose />
                      </Button>
                    ) : (
                      <Button
                        className="text-2xl !px-1"
                        size="sm"
                        onPress={() => setIsVisible(!isVisible)}
                        variant="bordered"
                        isIconOnly
                      >
                        <TiEdit />
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
                          setShowEmojiPicker={() =>
                            setShowEmojiPicker(!showEmojiPicker)
                          }
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
                <Button color="primary" onPress={() => onSubmit(onClose)}>
                  Post
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
      </Modal>
    </div>
  );
};

export default AnswerModal;
