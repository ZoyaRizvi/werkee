import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Input,
  Typography,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, or } from "firebase/firestore";
import { useAuth } from '../../context/authContext/';

export function Chat() {
  const { userLoggedIn, dbUser } = useAuth();
  const [messages1, setMessages1] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [messages3, setMessages3] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [uniqueChatList, setUniqueChatList] = useState([]);
  const [uniqueUsersList, setUniqueUsersList] = useState([]);
  const [recruiter, setRecruiter] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [newMessagePost, setNewMessagePost] = useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: selectedChat.email,
        users: [dbUser.email, selectedChat.email],
        text: newMessage,
        timestamp: Timestamp.now(),
      });
      setNewMessage("");
    }
  };

  const handleNewSendMessage = async () => {
    if (newMessagePost.trim()) {
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: recruiter,
        users: [dbUser.email, recruiter],
        text: `New message for job: ${jobTitle} from ${dbUser.email}`,
        timestamp: Timestamp.now(),
      });
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: recruiter,
        users: [dbUser.email, recruiter],
        text: newMessagePost,
        timestamp: Timestamp.now(),
      });
      setNewMessagePost("");
      handleOpen();
      window.location.href = '/dashboard/chat';
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (recruiter) {
      handleOpen();
    } else {
      setSelectedChat(uniqueUsersList[0]);
    }
  }, [uniqueUsersList, recruiter]);

  useEffect(() => {
    if (!dbUser) return;
    const q = query(collection(db, "messages"), or(where("from", "==", dbUser.email), where("to", "==", dbUser.email)), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const chatList = snapshot.docs.flatMap(doc => {
        const data = doc.data();
        return [data.from, data.to];
      });
      setUniqueChatList([...new Set(chatList)]);
      const urlParams = new URLSearchParams(window.location.search);
      setRecruiter(urlParams.get('reference'));
      setJobTitle(decodeURI(urlParams.get('job')));
    });
    return () => unsubscribe();
  }, [dbUser]);

  useEffect(() => {
    if (uniqueChatList.length === 0) return;
    const q = query(collection(db, "users"), where("email", "in", uniqueChatList), where("email", "!=", dbUser.email), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setUniqueUsersList(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [uniqueChatList, dbUser.email]);

  useEffect(() => {
    if (!selectedChat) return;
    const q1 = query(collection(db, "messages"), where("from", "==", dbUser.email), where("to", "==", selectedChat.email), orderBy("timestamp"));
    const q2 = query(collection(db, "messages"), where("from", "==", selectedChat.email), where("to", "==", dbUser.email), orderBy("timestamp"));
    const unsubscribe1 = onSnapshot(q1, snapshot => {
      setMessages1(snapshot.docs.map(doc => doc.data()));
    });
    const unsubscribe2 = onSnapshot(q2, snapshot => {
      setMessages2(snapshot.docs.map(doc => doc.data()));
    });
    return () => { unsubscribe1(); unsubscribe2(); };
  }, [selectedChat, dbUser.email]);

  useEffect(() => {
    const combined = [...messages1, ...messages2];
    combined.sort((a, b) => a.timestamp - b.timestamp);
    setMessages3(combined);
  }, [messages1, messages2]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredChats = uniqueUsersList.filter((chat) =>
    chat.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex" style={{ height: 'calc(100vh - 100px)' }}>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody>
          <form onSubmit={handleNewSendMessage} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            {recruiter &&
              <Typography variant="regular" color="blue-gray" className="font-medium">Applying for {jobTitle ? jobTitle : null}</Typography>}
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="border border-gray-300 rounded-md mt-2"
              value={recruiter}
              onChange={e => setRecruiter(e.target.value)}
            />
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">Add a message</Typography>
              <div className="flex items-center">
                <Input
                  type="text"
                  value={newMessagePost}
                  onChange={(e) => setNewMessagePost(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleNewSendMessage()}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 rounded-lg mr-4"
                />
                <Button color="blue" onClick={handleNewSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search chats..."
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            className="w-full"
          />
          <Button onClick={handleOpen} variant="gradient">
            <PlusIcon className="h-4 w-8" />
          </Button>
        </div>
        {filteredChats.map((chat) => (
          <div key={chat.email}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100`}
            onClick={() => setSelectedChat(chat)}>
            <div>
              <Typography variant="small" color="blue-gray" className={(selectedChat && selectedChat.email === chat.email) ? 'font-semibold' : ''}>
                {chat.displayName}
              </Typography>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {chat.role}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 p-4 bg-white">
        <div className="border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden">
          {selectedChat && (
            <div className="border-b border-gray-200 p-4 flex items-center">
              <Avatar src={selectedChat.img} alt={selectedChat.displayName} size="sm" variant="rounded" />
              <div className="ml-4">
                <Typography variant="h6" color="blue-gray">
                  {selectedChat.displayName}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {selectedChat.email}
                </Typography>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            {messages3.map((message) => (
              <div key={message.timestamp} className={`flex ${message.from === dbUser.email ? "justify-end" : ""} mb-4`}>
                <div className={`flex flex-col ${message.from === dbUser.email ? "items-end" : "items-start"}`}>
                  <Typography variant="small" color="blue-gray" className='font-semibold'>
                    {message.from}
                  </Typography>
                  <Typography className="bg-blue-100 p-2 rounded-md text-blue-gray-800">
                    {message.text}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500">
                    {message.timestamp.toDate().toUTCString()}
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