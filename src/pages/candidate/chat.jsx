import React, { useEffect, useState } from "react";
import { authorsTableData } from "@/data";
import {
  Avatar,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    let chat = authorsTableData.find(e => e.email === userEmail);
    if (chat && chat.email === 'admin@test.com') {
      chat = authorsTableData.find(e => e.email === "beta-tester@test.com");
    } else if (!chat) {
      chat = authorsTableData.find(e => e.email === "admin@test.com");
    }
    setSelectedChat(chat);
  }, [userEmail]);

  useEffect(() => {
    if (!selectedChat) return;

    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })));
    });
    return () => unsubscribe();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        userID: userEmail,
        text: newMessage,
        timestamp: Timestamp.now(),
      });
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
            className="w-full"
          />
          <PlusIcon className="h-4 w-8" />
        </div>
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 ${selectedChat && selectedChat.id === chat.id ? 'bg-gray-100' : ''}`}
            onClick={() => setSelectedChat(chat)}
          >
            <Avatar src={chat.img} alt={chat.name} size="sm" variant="rounded" />
            <div>
              <Typography variant="small" color="blue-gray" className={(selectedChat && selectedChat.name === chat.name) ? 'font-semibold' : 'body1'}>
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
          {selectedChat && (
            <div className="border-b border-gray-200 p-4 flex items-center">
              <Avatar src={selectedChat.img} alt={selectedChat.name} size="sm" variant="rounded" />
              <Typography variant="h6" color="blue-gray" className="ml-4">
                {selectedChat.name}
              </Typography>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.data.userID === userEmail ? "justify-end" : ""} mb-4`}>
                <div className={`flex flex-col ${message.data.userID === userEmail ? "items-end" : "items-start"}`}>
                  <Typography variant="small" color="blue-gray" className='font-semibold'>
                    {message.data.userID}
                  </Typography>
                  <Typography className="bg-blue-100 p-2 rounded-md text-blue-gray-800">
                    {message.data.text}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500">
                    {message.data.timestamp.toDate().toUTCString()}
                  </Typography>
                </div>
              </div>
            ))}
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
