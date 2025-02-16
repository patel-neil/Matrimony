import React, { useState } from 'react';
import { UserButton } from "@clerk/clerk-react";
import { Bell, Heart, Search, LogIn, MessageCircle, Send, X } from 'lucide-react';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for chats
  const chatList = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Looking forward to our conversation!",
      time: "2:34 PM",
      unread: true,
      online: true
    },
    {
      id: 2,
      name: "Michael Brown",
      lastMessage: "Hello! How are you doing today?",
      time: "1:15 PM",
      unread: false,
      online: false
    },
    {
      id: 3,
      name: "Jessica Smith",
      lastMessage: "That sounds great! When should we...",
      time: "Yesterday",
      unread: false,
      online: true
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // Here you would typically send the message to your backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-rose-600">Shadi.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-rose-600" />
            <Heart className="h-5 w-5 text-gray-600 cursor-pointer hover:text-rose-600" />
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>
      </header>

      {/* Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm flex h-[80vh]">
          {/* Chat List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                    selectedChat === chat.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{chat.name}</h3>
                      <span className="text-sm text-gray-500">{chat.time}</span>
                    </div>
                    <p className={`text-sm ${chat.unread ? 'font-semibold text-gray-900' : 'text-gray-600'} truncate`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          {selectedChat ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {chatList.find(chat => chat.id === selectedChat)?.name}
                    </h3>
                    <p className="text-sm text-gray-600">Online</p>
                  </div>
                </div>
                <X
                  className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => setSelectedChat(null)}
                />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex">
                  <div className="max-w-[70%] bg-gray-100 p-3 rounded-lg">
                    <p>Hi! I saw your profile and would love to get to know you better.</p>
                    <span className="text-xs mt-1 block text-gray-500">2:30 PM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-rose-600 text-white p-3 rounded-lg">
                    <p>Hello! Thank you for reaching out. I'd love to chat and learn more about you too!</p>
                    <span className="text-xs mt-1 block opacity-70">2:34 PM</span>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="bg-rose-600 text-white px-6 rounded-lg hover:bg-rose-700 flex items-center gap-2 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;