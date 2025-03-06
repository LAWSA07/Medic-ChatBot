import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t border-green-200 p-4 bg-green-100"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your health question here..."
        className="flex-1 border border-green-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`bg-green-600 text-white p-2 rounded-r-lg ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
        disabled={isLoading}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;
