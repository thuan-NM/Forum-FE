"use client";

import {
  Avatar,
  Button,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { MdClear } from "react-icons/md";
import { useCreateQuestion } from "../../../hooks/questions/useCreateQuestion";
import TopicSelectionModal from "./TopicSelectionModal";
import { TopicResponse } from "../../../store/interfaces/topicInterfaces";
import { useQuery } from "@tanstack/react-query";
import { GetFollowedTopics } from "../../../services";
import { Icon } from "@iconify/react";
import { useGetUserInfo } from "../../../utils/getUserInfo";

interface PostModalProps {
  setModalActive: (arg0: string) => void;
}

const QuestionModal: React.FC<PostModalProps> = ({ setModalActive }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(
    null
  );
  const user = useGetUserInfo();
  const { createQuestion, isCreating } = useCreateQuestion();
  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: () => GetFollowedTopics(),
  });

  const onSubmit = (onClose: () => void) => {
    if (!selectedTopic?.id) return;

    createQuestion(
      {
        title,
        description,
        topicId: Number(selectedTopic.id),
      },
      {
        onSuccess: () => {
          onClose();
          setModalActive("");
        },
      }
    );
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
                  className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out border-b-2 border-blue-400"
                  onPress={() => setModalActive("Ask")}
                >
                  Thêm câu hỏi
                </Button>
                <Button
                  className="bg-transparent w-1/2 rounded-none text-base font-semibold transition duration-300 ease-in-out"
                  onPress={() => setModalActive("Post")}
                >
                  Tạo bài viết
                </Button>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="bg-content2 rounded-sm backdrop-opacity-60 p-4">
                <p className="font-bold">Mẹo để nhận được câu trả lời tốt</p>
                <ul className="list-disc list-inside font-light">
                  <li>Đảm bảo câu hỏi của bạn chưa từng được hỏi</li>
                  <li>Giữ câu hỏi ngắn gọn, rõ ràng</li>
                  <li>Kiểm tra lỗi chính tả và ngữ pháp</li>
                </ul>
              </div>
              <div className="pt-2">
                <div className="flex items-center">
                  <Avatar
                    className="w-6 h-6 text-tiny mr-1"
                    src={
                      user?.avatar
                        ? user.avatar
                        : "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                    }
                  />
                  <FaCaretRight className="mr-1" />

                  <Button
                    variant="bordered"
                    radius="full"
                    className="px-2 py-0 text-sm texxt-black/80 dark:text-white/80"
                    onPress={() => setIsTopicModalOpen(true)}
                    size="sm"
                  >
                    <Icon icon="material-symbols:book-3" className="w-5 h-5" />
                    {selectedTopic ? selectedTopic.name : "Chọn chủ đề"}
                    <FaAngleDown />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col w-full gap-y-4 mt-2 mb-10">
                <Input
                  variant="underlined"
                  className="!text-2xl"
                  placeholder="Bắt đầu với: Cái gì?, Tại sao?, Như thế nào?..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Viết mô tả cho câu hỏi tại đây..."
                  variant="underlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter className="border-none border-content3 p-0 py-3 px-6">
              <Button
                className="border-none bg-transparent hover:bg-content2 px-0"
                radius="full"
                size="sm"
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color="primary"
                radius="full"
                className="px-5"
                size="sm"
                isLoading={isCreating}
                onPress={() => onSubmit(onClose)}
              >
                Thêm câu hỏi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>

      {/* Modal chọn topic */}
      <TopicSelectionModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        topics={topics || []}
        selectedTopic={selectedTopic}
        onTopicSelect={(topic) => setSelectedTopic(topic)}
      />
    </div>
  );
};

export default QuestionModal;
