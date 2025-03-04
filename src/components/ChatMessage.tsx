import React from 'react';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isUser ? 'bg-blue-500 ml-3' : 'bg-green-500 mr-3'}`}>
          {isUser ? <User className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
        </div>
        <div className={`py-3 px-4 rounded-lg ${isUser ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
          <p className="text-sm">{message.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;