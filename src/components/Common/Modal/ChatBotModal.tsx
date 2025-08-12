import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Input,
  ScrollShadow,
  Button,
  Chip,
  Avatar,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSendMessage } from "../../../hooks/chatbot/useSendMessage";
import { useGetUserInfo } from "../../../utils/getUserInfo";

interface AIChatModalProps {
  onClose: () => void;
  isMobile: boolean;
}

interface Message {
  id: number;
  content: React.ReactNode;
  sender: "user" | "ai";
  isLoading?: boolean;
}

const predefinedQuestions = [
  "Về chúng tôi",
  "Liên hệ",
  "Thông tin về trang web",
];

const AIChatModal: React.FC<AIChatModalProps> = ({ onClose, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isSending } = useSendMessage();
  const userData = useGetUserInfo();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() && !isSending) {
      const newMessage: Message = {
        id: Date.now(),
        content: input,
        sender: "user",
      };
      const loadingMessage: Message = {
        id: Date.now() + 1,
        content: "Tôi đang xử lý yêu cầu của bạn, vui lòng đợi một xíu nhé",
        sender: "ai",
        isLoading: true,
      };
      setMessages([...messages, newMessage, loadingMessage]);
      setInput("");

      sendMessage(input, {
        onSuccess: (response) => {
          const related = response.related_questions || [];
          const aiContent = (
            <div>
              <div>Dưới đây là các câu hỏi liên quan: </div>
              <div>Hy vọng bạn tìm được câu trả lời thích hợp</div>
              {related.length > 0 ? (
                <>
                  <ul className="space-y-2 mt-2">
                    {related.map((q: any) => (
                      <li
                        key={q.id}
                        className="flex flex-row items-center gap-x-1"
                      >
                        <span
                          onClick={() =>
                            window.open(`/question/${q.id}`, "_blank")
                          }
                          className="text-sm cursor-pointer hover:underline"
                        >
                          {q.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                "Không tìm thấy câu hỏi liên quan."
              )}
            </div>
          );
          const aiResponse: Message = {
            id: Date.now(),
            content: aiContent,
            sender: "ai",
          };
          setMessages((prev) => [...prev, aiResponse]);
        },
        onError: () => {
          const errorResponse: Message = {
            id: Date.now(),
            content: "Lỗi khi gọi API.",
            sender: "ai",
          };
          setMessages((prev) => [...prev, errorResponse]);
        },
      });
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    const predefinedAnswers: Record<string, string> = {
      "Về chúng tôi":
        "Tôi là Nguyễn Minh Thuận, mã số sinh viên B2106816 là sinh viên của trường Đại học Cần Thơ đang theo học chuyên ngành khoa học máy tính.",
      "Liên hệ":
        "Bạn có thể liên hệ với chúng tôi qua email: thuanb2106816@student.ctu.edu.vn hoặc qua số điện thoại 0945362373 hoặc cũng có thể liên hệ tôi qua https://www.linkedin.com/in/thuannguyen-ws/",
      "Thông tin về trang web":
        "Đây là một diễn đàn dành cho sinh viên thuộc các nhóm ngành Công nghệ thông tin và truyền thông của trường Đại học Cần Thơ. Với các tính năng cơ bản của một forum cùng với tiện ích về AI đã được tích hợp.",
    };
    const userMessage: Message = {
      id: Date.now(),
      content: question,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now(),
        content:
          predefinedAnswers[question] ||
          "Xin lỗi, tôi chưa có thông tin về câu hỏi này.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card
        className={`w-full bg-content1 shadow-xl px-0 flex flex-col overflow-hidden fixed bottom-10 right-[120px] z-50 max-w-[400px] ${
          isMobile ? "h-[100vh] rounded-none" : "h-[500px] rounded-2xl"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center"
                animate={{
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <Icon
                  icon="ph:open-ai-logo-light"
                  className="text-content1"
                  width={24}
                  height={24}
                />
              </motion.div>
              <h2 className="text-lg font-semibold text-white">Katz</h2>
            </div>
            <Button
              isIconOnly
              color="default"
              variant="light"
              onPress={onClose}
              className="rounded-full text-white"
            >
              <Icon icon="lucide:x" width={24} />
            </Button>
          </div>
          <div className="flex-grow flex flex-col p-4 space-y-4 overflow-hidden ">
            {/* Predefined Questions */}
            <div className="flex flex-row flex-wrap gap-2 min-h-fit">
              {predefinedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  color="primary"
                  isDisabled={isSending}
                  variant="flat"
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handlePredefinedQuestion(question)}
                >
                  {question}
                </Chip>
              ))}
            </div>
            <Divider />
            {/* Chat Messages */}
            <ScrollShadow
              className="flex-grow overflow-y-auto px-2"
              size={20}
              style={{ scrollbarWidth: "thin" }}
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex mb-4 break-words ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end space-x-2 ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse break-words"
                          : ""
                      }`}
                    >
                      <Avatar
                        src={
                          message.sender === "user"
                            ? `${userData?.avatar} ` ||
                              "https://img.heroui.chat/image/avatar?w=40&h=40&u=user"
                            : "https://img.heroui.chat/image/ai?w=40&h=40&u=assistant"
                        }
                        size="sm"
                      />
                      <div
                        className={`p-3 rounded-lg max-w-[80%] ${
                          message.sender === "user"
                            ? "bg-content3"
                            : "bg-content2"
                        }`}
                      >
                        <div className="text-black dark:text-white text-sm">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollShadow>
            {/* Input for sending messages */}
            <div className="w-full bg-content2 rounded-full p-2 !text-black dark:!text-white ">
              <Input
                classNames={{
                  base: "h-10",
                  mainWrapper: "h-full",
                  input: "text-small !text-black dark:!text-white ",
                  inputWrapper:
                    "h-full font-normal border-none shadow-none !bg-transparent",
                }}
                isDisabled={isSending}
                placeholder="Type your message..."
                size="sm"
                startContent={
                  <Icon
                    icon="lucide:message-circle"
                    className="text-gray-400"
                    width={20}
                  />
                }
                endContent={
                  <motion.div
                    className="relative rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      onPress={handleSendMessage}
                      className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 "
                      isDisabled={isSending || !input.trim()}
                    >
                      <Icon
                        icon="lucide:send"
                        width={16}
                        className="text-white"
                      />
                    </Button>
                  </motion.div>
                }
                value={input}
                onValueChange={setInput}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isSending && handleSendMessage()
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIChatModal;
