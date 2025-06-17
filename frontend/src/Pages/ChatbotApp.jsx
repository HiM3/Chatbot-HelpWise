import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Mode from "../Components/Mode";
import { motion } from "framer-motion";
import { chatService } from '../services/api';
import { toast } from 'react-hot-toast';

import {
  FaRobot,
  FaPlus,
  FaTrash,
  FaSync,
  FaStop,
  FaDownload,
  FaPaperclip,
  FaPaperPlane,
} from "react-icons/fa";

const ChatbotApp = () => {
  const navigate = useNavigate();
  const [chatTitle, setChatTitle] = useState("New Conversation");
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
    loadChatHistory();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const loadChatHistory = async () => {
    try {
      const response = await chatService.getChatHistory();
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      navigate('/login');
      return;
    }

    const newMessages = [...messages, { text: message, from: 'user' }];
    setMessages(newMessages);
    setMessage('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(message);
      setMessages([...newMessages, { text: response.data.reply, from: 'bot' }]);
    } catch (error) {
      toast.error('Failed to send message');
      setMessages([
        ...newMessages,
        { text: '❌ Error: Could not connect to chatbot.', from: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen flex justify-center items-center font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] transition-colors duration-300 ${darkMode ? "bg-[#1c1e26] text-[#f4f4f4]" : "bg-[#f4f8fb] text-[#0d1b2a]"}`}>
      <motion.div 
        className="flex w-[95%] max-w-[1400px] h-[95%] rounded-lg overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sidebar */}
        <div className={`w-[280px] flex flex-col p-5 box-border transition-colors duration-300 ${darkMode ? "bg-[#2d334a] text-[#f4f4f4]" : "bg-[#dce8f2] text-[#0d1b2a]"}`}>
          <div className="text-2xl font-bold flex items-center gap-2 mb-8">
            <FaRobot />
            <span>HelpWise Chatbot</span>
          </div>

          <button
            className="bg-[#3498db] text-white py-3 px-4 rounded-lg mb-5 cursor-pointer text-base w-full flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-[#2980b9]"
            onClick={() => {
              setChatTitle("New Conversation");
              setMessages([]);
            }}
          >
            <FaPlus />
            New Chat
          </button>

          <div className="history-container">
            <h3 className="text-base mb-2">History</h3>
            <div id="chat-history">
              <p>No history yet.</p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <button 
              className="bg-transparent border-none text-base flex items-center gap-2 cursor-pointer text-inherit transition-colors duration-200 hover:text-[#4e7cff]" 
              onClick={async () => {
                try {
                  await chatService.clearHistory();
                  setMessages([]);
                  toast.success('Chat history cleared');
                } catch (error) {
                  toast.error('Failed to clear chat history');
                }
              }}
            >
              <FaTrash />
              Clear History
            </button>
            <Mode darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col transition-colors duration-300 ${darkMode ? "bg-[#222630]" : "bg-[#f4f9ff]"}`}>
          <div className="flex justify-between p-4 border-b border-[#e1e4e8] items-center bg-inherit">
            <div className="text-xl font-semibold">{chatTitle}</div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <button className="bg-transparent border-none text-lg cursor-pointer text-inherit transition-colors duration-200 hover:text-[#4e7cff]" title="Regenerate">
                  <FaSync />
                </button>
                <button className="bg-transparent border-none text-lg cursor-pointer text-inherit transition-colors duration-200 hover:text-[#4e7cff]" title="Stop">
                  <FaStop />
                </button>
                <button className="bg-transparent border-none text-lg cursor-pointer text-inherit transition-colors duration-200 hover:text-[#4e7cff]" title="Download">
                  <FaDownload />
                </button>
              </div>
              <div className="flex gap-2">
                {isAuthenticated ? (
                  <button 
                    className={`
                      bg-[#4e7cff] text-white py-2 px-4 rounded-md text-base flex items-center justify-center gap-2 cursor-pointer shadow-md 
                      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg 
                      dark:bg-[#6a4ef4] dark:shadow-md dark:hover:bg-[#553bb8] dark:hover:shadow-xl
                    `}
                    onClick={() => {
                      localStorage.removeItem('token');
                      setIsAuthenticated(false);
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button 
                    className={`
                      bg-[#4e7cff] text-white py-2 px-4 rounded-md text-base flex items-center justify-center gap-2 cursor-pointer shadow-md 
                      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg 
                      dark:bg-[#6a4ef4] dark:shadow-md dark:hover:bg-[#553bb8] dark:hover:shadow-xl
                    `}
                    onClick={() => navigate('/login')}
                  >
                    Login / Signup
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-5 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center mt-12">
                <h1 className="text-3xl mb-2">Welcome to HelpWise AI Chatbot</h1>
                <p className="text-base mb-5 text-inherit">Ask anything. Powered by OpenAI.</p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <button
                    className={`
                      bg-[#d0d3d8] py-2.5 px-4 rounded-full border-none cursor-pointer 
                      transition-colors duration-300 hover:bg-[#aaa] 
                      dark:bg-[#444] dark:text-white
                    `}
                    onClick={() => setMessage("Tell me a joke")}
                  >
                    Tell me a joke
                  </button>
                  <button
                    className={`
                      bg-[#d0d3d8] py-2.5 px-4 rounded-full border-none cursor-pointer 
                      transition-colors duration-300 hover:bg-[#aaa] 
                      dark:bg-[#444] dark:text-white
                    `}
                    onClick={() => setMessage("Explain AI")}
                  >
                    Explain AI
                  </button>
                  <button
                    className={`
                      bg-[#d0d3d8] py-2.5 px-4 rounded-full border-none cursor-pointer 
                      transition-colors duration-300 hover:bg-[#aaa] 
                      dark:bg-[#444] dark:text-white
                    `}
                    onClick={() => setMessage("How to cook pasta?")}
                  >
                    How to cook pasta?
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`
                  p-3 pr-4 mb-3 max-w-[80%] rounded-lg break-words
                  ${msg.from === 'user' ? 'self-end bg-[#3498db] text-white' : 'self-start bg-[#e1ecf9] text-black'}
                `}>
                  {msg.text}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#ccc] p-4 bg-inherit">
            <div className={`
              flex items-center rounded-3xl p-2.5 px-4 shadow-sm 
              bg-[#f1f4f8] border border-[#cdd9e5] transition-colors duration-300 
              dark:bg-[#3b3b3b] dark:border-[#555] dark:shadow-md
            `}>
              <textarea
                rows="1"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className={`
                  flex-1 resize-none border-none bg-transparent text-base py-2 px-0 
                  text-inherit outline-none font-inherit
                `}
              ></textarea>
              <button title="Send" onClick={handleSendMessage}
                className={`
                  bg-transparent border-none text-lg cursor-pointer text-[#4e7cff] 
                  flex items-center justify-center p-1.5 transition-colors duration-300 
                  hover:text-[#375eda] dark:text-[#aac4ff] dark:hover:text-[#d0e0ff]
                `}
              >
                <FaPaperPlane />
              </button>
            </div>

            <div className="text-xs text-[#999] text-center mt-2">
              AI responses may be inaccurate. This chat is not stored on server.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotApp;
