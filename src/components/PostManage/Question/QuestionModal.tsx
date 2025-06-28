import {
  Avatar,
  Button,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { LuUsers, LuUser } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import { MdClear } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateQuestion } from "../../../services/QuestionServices";
import toast from "react-hot-toast";
import { QuestionCreateDto } from "../../../store/interfaces/questionInterfaces";

interface PostModalProps {
  setModalActive: (arg0: string) => void;
}

const QuestionModal: React.FC<PostModalProps> = ({ setModalActive }) => {
  const [typeOfQuestion, setTypeOfQuestion] = useState<string>("public");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const handleChange = (questionType: string) => {
    setTypeOfQuestion(questionType);
    setIsPopoverOpen(false);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CreateQuestion,
    onSuccess: (data) => {
      toast.success(data.message, {
        style: {
          fontSize: "12px",
          lineHeight: "1.25rem",
          fontWeight: "500",
        },
      });
      setModalActive("");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const onSubmit = (onClose: () => void) => {
    const data: QuestionCreateDto = {
      title: title,
      description: "",
      topicId: "",
    };
    mutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <div>
      <ModalContent>
        {(onClose) => (
          <>
            <Button
              isIconOnly
              className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full"
              onPress={onClose}
            >
              <MdClear className="w-7 h-7" />
            </Button>
            <ModalHeader className="flex flex-col gap-1 pt-1">
              <div className="flex justify-between border-b-2 border-content3">
                <Button
                  className={`bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out border-b-2 border-blue-400`}
                  onPress={() => setModalActive("Ask")}
                >
                  Add Question
                </Button>
                <Button
                  className={`bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out`}
                  onPress={() => setModalActive("Post")}
                >
                  Create Post
                </Button>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="bg-content2 rounded-sm backdrop-opacity-60 p-4">
                <p className="font-bold">
                  Tips on getting good answers quickly
                </p>
                <ul className="list-disc list-inside font-light">
                  <li>Make sure your question has not been asked already</li>
                  <li>Keep your question short and to the point</li>
                  <li>Double-check grammar and spelling</li>
                </ul>
              </div>
              <div className="pt-2">
                <div className="flex items-center">
                  <Avatar
                    className="w-6 h-6 text-tiny mr-1"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
                  <FaCaretRight className="mr-1" />
                  <Popover
                    showArrow
                    offset={20}
                    placement="bottom"
                    isOpen={isPopoverOpen}
                    onOpenChange={setIsPopoverOpen}
                  >
                    <PopoverTrigger className="flex items-center">
                      {typeOfQuestion == "public" ? (
                        <Button
                          variant="bordered"
                          radius="full"
                          className="px-2 py-0"
                          size="sm"
                        >
                          <LuUsers className="w-5 h-5" />
                          Public
                          <FaAngleDown />
                        </Button>
                      ) : (
                        <Button
                          variant="bordered"
                          radius="full"
                          className="px-2 py-0"
                          size="sm"
                        >
                          <LuUser className="w-5 h-5" />
                          Limited
                          <FaAngleDown />
                        </Button>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="p-0 ">
                      <div className="flex flex-col !items-start rounded-full">
                        <Button
                          className="p-3 w-full h-fit !text-left items-start flex-col rounded-b-none rounded-t-lg hover:underline"
                          variant="light"
                          size="sm"
                          onPress={() => handleChange("public")}
                        >
                          <div className="text-sm font-bold">Public</div>
                          <div className="text-tiny">
                            Others will see your identity alongside this
                            question on your profile and in their feeds.
                          </div>
                        </Button>
                        <Button
                          className="p-3 w-full h-fit !text-left items-start flex-col rounded-t-none rounded-b-lg hover:underline"
                          variant="light"
                          size="sm"
                          onPress={() => handleChange("limited")}
                        >
                          <div className="text-sm font-bold">Limited</div>
                          <div className="text-tiny">
                            Your identity will be shown but this question will
                            not appear in your followers' feeds or your profile.
                          </div>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="mb-36">
                <Input
                  variant="underlined"
                  className="!text-2xl"
                  placeholder='Start your question with "What", "How", "Why", etc.'
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-content3 p-0 py-3 px-6 ">
              <Button
                className="border-none bg-tranparent hover:bg-content2 px-0  text-sm font-semibold"
                radius="full"
                size="md"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                radius="full"
                className="px-5"
                size="md"
                onPress={() => onSubmit(onClose)}
              >
                Add question
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </div>
  );
};

export default QuestionModal;
