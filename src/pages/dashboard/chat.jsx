import React, { useEffect, useState, createContext, useContext } from "react";
import { authorsTableData } from "@/data";
import {
  Avatar,
  Button,
  Input,
  Typography,
  select,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, getDocs } from "firebase/firestore";
import { useAuth } from '../../context/authContext/';

export function Chat() {
  const { userLoggedIn, dbUser } = useAuth(); // Assuming useAuth provides user role
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // selected chat based off context provider
  const selectedChatContext = createContext(null);
  const [selectedChat, setSelectedChat] = useState(null); // todo set an initial value
  const [uniqueChatList, setUniqueChatList] = useState([]);
  const [uniqueUsersList, setUniqueUsersList] = useState([]);
  const [initalized, setInitialized] = useState(false);
  const [finalInit, setFinalInit] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (finalInit) {
      setSelectedChat(uniqueUsersList[0])
    }
  }, [finalInit])
  
  // Cross reference users from messages list (uniqueChatList), and return all users | uniqueUsersList

  useEffect(() => {
    if (initalized) {
      // Get users based off associated chats, filter from:userEmail
      const q = query(collection(db, "users"), where("email", "in", uniqueChatList), orderBy("createdAt"))
      const unsubscribe2 = onSnapshot(q, snapshot => {
        // Get only unique chats (since there are multiple messages from the same user)
        setUniqueUsersList(snapshot.docs.map(doc => (doc.data())))
        setFinalInit(true)
      });
      console.log(uniqueUsersList)
      return () => unsubscribe2();
    }
  }, [initalized])

  // Get a unique list of users from your associated messages | uniqueChatList - ARRAY

  useEffect(() => {
    if (!dbUser) return;
    // Get users based off associated chats, filter from:userEmail
    const q = query(collection(db, "messages"), where("from", "==", dbUser.email), orderBy("timestamp"))
    const unsubscribe = onSnapshot(q, snapshot => {
      // Get only unique chats (since there are multiple messages from the same user)
      setUniqueChatList(
        [ ...new Set(snapshot.docs.map(doc => (doc.data().to))) ]
      )
      setInitialized(true)
    });
    console.log(uniqueChatList)
    return () => unsubscribe();
  }, [dbUser]);

  // Set the Selected Chat element

  useEffect(() => {
    if (!selectedChat) return;

    // Get each users messages
    if (selectedChat) {
      const q = query(collection(db, "messages"), where("to", "==", selectedChat.email), orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, snapshot => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })));
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        from: userEmail,
        to: selectedChat.email, // to the selectedChat (uses context provider to re-render)
        text: newMessage,
        timestamp: Timestamp.now(),
      });
      setNewMessage("");
    }
  };

  const handleAddChat = async () => {

    // Popup with the fields: users email, a message

    // if (newTextBoxYouCreate.trim()) {
    //   await addDoc(collection(db, 'messages'), {
    //     from: userEmail,
    //     to: tofieldOnThePopup, // to the selectedChat (uses context provider to re-render)
    //     text: newTextBoxYouCreate,
    //     timestamp: Timestamp.now(),
    //   });
    //   setnewTextBoxYouCreate("");
    // }
  };

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
      <div className="flex" style={{height: 'calc(100vh - 100px'}}>
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto" style={{height: 'calc(100vh - 120px'}}>
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
          {filteredChats && filteredChats.map((chat) => (
            <div key={chat.displayName}
              className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100`}
              onClick={() => setSelectedChat(chat)}>
              {/* <Avatar src={chat.img} alt={chat.name} size="sm" variant="rounded" /> */}
              <div>
                <Typography variant="small" color="blue-gray" className={(selectedChat && selectedChat.email === chat.email) ? 'font-semibold' : 'body1'}>
                  {chat.displayName}
                </Typography>
                <Typography className="text-xs font-normal text-blue-gray-500">
                  {chat.role}
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
                <Avatar src={selectedChat.img} alt={selectedChat.displayName} size="sm" variant="rounded" />
                <Typography variant="h6" color="blue-gray" className="ml-4">
                  {selectedChat.displayName}
                </Typography>
              </div>
            )}
            <selectedChatContext.Provider value={selectedChat}>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div key={message.data.timestamp} className={`flex ${message.data.from === userEmail ? "justify-end" : ""} mb-4`}>
                    <div className={`flex flex-col ${message.data.from === userEmail ? "items-end" : "items-start"}`}>
                      <Typography variant="small" color="blue-gray" className='font-semibold'>
                        {message.data.from}
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
            </selectedChatContext.Provider>
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
