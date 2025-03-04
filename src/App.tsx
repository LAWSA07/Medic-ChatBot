import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { AArrowDown as uuidv4 } from 'lucide-react';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import { Message, ChatState } from './types';
import { generateResponse } from './services/huggingfaceService';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      // Get response from Hugging Face
      const response = await generateResponse(content);

      // Add assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }));
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 z-10 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-bold text-gray-800">HealthCare</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Health Resources</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-100 text-blue-600">
                Medical Encyclopedia
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-100 text-blue-600">
                Symptom Checker
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-100 text-blue-600">
                Find a Doctor
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 rounded hover:bg-gray-100 text-blue-600">
                Emergency Information
              </a>
            </li>
          </ul>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Disclaimer</h3>
            <p className="text-sm text-blue-700">
              This chatbot provides general information only and should not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Healthcare Assistant</h1>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm m-4 overflow-hidden">
          <ChatContainer 
            messages={chatState.messages} 
            isLoading={chatState.isLoading} 
          />
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={chatState.isLoading} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;