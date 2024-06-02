import { useState } from "react";
import { authorsTableData } from "@/data";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([
      { author: chat.name, text: "Hello, how are you?", timestamp: "10:00 AM" },
      { author: "You", text: "I'm good, thanks! How about you?", timestamp: "10:02 AM" },
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { author: "You", text: newMessage, timestamp: new Date().toLocaleTimeString() },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = authorsTableData.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search chats..."
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            inputClassName="placeholder-gray-400 italic"
            className="w-full"
          />
            <PlusIcon className="h-4 w-8" />
        </div>
        {filteredChats.map((chat, key) => (
          <div
            key={chat.name}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 ${selectedChat === chat ? 'bg-gray-100' : ''}`}
            onClick={() => handleSelectChat(chat)}
          >
            <Avatar src={chat.img} alt={chat.name} size="sm" variant="rounded" />
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                {chat.name}
              </Typography>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {chat.job[0]}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-4 bg-white">
        <div className="border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {selectedChat ? (
     messages.map((message, index) => (
        <div key={index} className={`flex ${message.author === "You" ? "justify-end" : ""} mb-4`}>
          <div className={`flex flex-col ${message.author === "You" ? "items-end" : "items-start"}`}>
            <Typography variant="small" color="blue-gray" className="font-semibold">
              {message.author}
            </Typography>
            <Typography className="bg-blue-100 p-2 rounded-md text-blue-gray-800">
              {message.text}
            </Typography>
            <Typography variant="small" className="text-blue-gray-500">
              {message.timestamp}
            </Typography>
          </div>
        </div>
              ))
            ) : (
              <Typography className="text-center text-blue-gray-500">
                Select a chat to start messaging
              </Typography>
            )}
          </div>
          {selectedChat && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 rounded-lg mr-4"
                />
                <Button color="blue" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

  export default Chat;
  
  