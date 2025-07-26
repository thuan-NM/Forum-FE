import React from "react";
import { Icon } from "@iconify/react";
import { Button, Input, Avatar, Tooltip } from "@heroui/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatModalProps {
  apiEndpoint: string;
  avatarUrl?: string;
  className?: string;
}

const ChatBotModal: React.FC<ChatModalProps> = ({
  apiEndpoint,
  avatarUrl,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);

  const { data: initialMessage } = useQuery({
    queryKey: ["initialMessage"],
    queryFn: async () => {
      const response = await axios.get(`${apiEndpoint}/initial-message`);
      return response.data as Message;
    },
    enabled: isExpanded,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await axios.post(`${apiEndpoint}/send-message`, {
        content,
      });
      return response.data as Message;
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  React.useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [initialMessage, messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      sendMessageMutation.mutate(input);
      setInput("");
    }
  };

  return (
    <AnimatePresence>
      {!isExpanded ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2 }}
          className={twMerge("fixed bottom-6 right-10 z-50", className)}
        >
          <Tooltip content="Chat with AI" placement="left">
            <Button
              isIconOnly
              color="primary"
              variant="shadow"
              onPress={() => setIsExpanded(true)}
              className="rounded-full w-14 h-14"
            >
              <Icon icon="lucide:message-circle" width={24} height={24} />
            </Button>
          </Tooltip>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="w-80 h-[500px] flex flex-col bg-content2 rounded-xl shadow-xl overflow-hidden border-content4">
            <div className="flex justify-between items-center p-4 bg-content1 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Avatar src={avatarUrl} name="AI Assistant" size="sm" />
                <span className="font-semibold">Hệ thống hỗ trợ</span>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsExpanded(false)}
                className="text-primary-foreground"
              >
                <Icon icon="lucide:x" width={20} height={20} />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-default-100 dark:bg-default-700 rounded-bl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-default-50 dark:bg-default-800">
              <Input
                fullWidth
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="rounded-full"
                endContent={
                  <Button
                    isIconOnly
                    color="primary"
                    variant="flat"
                    onPress={handleSendMessage}
                    className="rounded-full"
                  >
                    <Icon icon="lucide:send" width={18} height={18} />
                  </Button>
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBotModal;
