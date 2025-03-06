import React from "react";
import { Message } from "../types";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full my-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex items-center justify-center h-10 w-10 rounded-full ${
            isUser ? "bg-green-600 ml-3" : "bg-green-800 mr-3"
          }`}
        >
          {isUser ? (
            <User className="h-6 w-6 text-white" />
          ) : (
            <Bot className="h-6 w-6 text-white" />
          )}
        </div>
        <div
          className={`py-3 px-4 rounded-lg ${
            isUser
              ? "bg-green-200 text-green-900"
              : "bg-green-100 text-green-900"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className="text-xs text-green-600 mt-1">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
