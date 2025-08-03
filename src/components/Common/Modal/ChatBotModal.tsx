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

interface AIChatModalProps {
  onClose: () => void;
  isMobile: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const predefinedQuestions = [
  "What can you do?",
  "Tell me a joke",
  "What's weather like?",
  "How to reset password?",
];
const AIChatModal: React.FC<AIChatModalProps> = ({ onClose, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: input,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInput("");
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now(),
          text: "I'm processing your request. How else can I assist you?",
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: question,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now(),
        text: `Here's a response to "${question}". How else can I assist you?`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };
  // const func =useClickOutside()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card
        className={`w-full bg-content1 shadow-xl px-0 flex flex-col overflow-hidden fixed bottom-20 right-[60px] z-50 max-w-[400px] ${
          isMobile ? "h-[100vh] rounded-none" : "h-[500px] rounded-2xl"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <Icon
                  icon="lucide:bot"
                  className="text-blue-600"
                  width={24}
                  height={24}
                />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
            </div>
            {
              <Button
                isIconOnly
                color="default"
                variant="light"
                onPress={onClose}
                className="rounded-full text-white"
              >
                <Icon icon="lucide:x" width={24} />
              </Button>
            }
          </div>

          <div className="flex-grow flex flex-col p-4 space-y-4 overflow-hidden ">
            {/* Predefined Questions */}
            {/* <ScrollShadow
              className="flex flex-wrap gap-2 pb-2"
              orientation="horizontal"
            > */}
            <div className="flex flex-row flex-wrap gap-2 min-h-fit">
              {predefinedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  color="primary"
                  variant="flat"
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handlePredefinedQuestion(question)}
                >
                  {question}
                </Chip>
              ))}
            </div>
            {/* </ScrollShadow> */}

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
                    className={`flex mb-4 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end space-x-2 ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar
                        src={
                          message.sender === "user"
                            ? "https://img.heroui.chat/image/avatar?w=40&h=40&u=user"
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
                        <p className="text-black dark:text-white text-sm">
                          {message.text}
                        </p>
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
                  <Button
                    isIconOnly
                    color="primary"
                    size="sm"
                    onPress={handleSendMessage}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    <Icon
                      icon="lucide:send"
                      width={16}
                      className="text-white"
                    />
                  </Button>
                }
                value={input}
                onValueChange={setInput}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIChatModal;
