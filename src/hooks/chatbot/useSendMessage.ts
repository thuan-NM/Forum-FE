// hooks/chat/useSendMessage.ts
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SendMessage } from "../../services/QuestionSuggestionServices";

export const useSendMessage = () => {
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await SendMessage(text);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Message sent successfully", {
        style: {
          fontSize: "12px",
          lineHeight: "1.25rem",
          fontWeight: "500",
        },
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to send message");
    },
  });

  return {
    sendMessage: mutation.mutate,
    isSending: mutation.isPending,
    sendError: mutation.error,
  };
};
