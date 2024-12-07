import React, { useEffect, useState, createContext, useContext } from "react";
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
import { setDoc,collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, or,doc } from "firebase/firestore";
import { useAuth } from '../../context/authContext/';
import PaymentModal from "./PaymentModal";



export function Chat() {
  const { userLoggedIn, dbUser } = useAuth();
  const [messages1, setMessages1] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [messages3, setMessages3] = useState([]);
  const [messagesReceived, setMessagesReceived] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedChatContext = createContext(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [uniqueChatList, setUniqueChatList] = useState([]);
  const [uniqueUsersList, setUniqueUsersList] = useState([]);
  const [initalized, setInitialized] = useState(false);
  const [finalInit, setFinalInit] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [newMessagePost, setNewMessagePost] = useState("");
  const [acceptedOffer, setAcceptedOffer] = useState(null);
  const [showMessage, setShowMessage] = useState(false);


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
        text: newMessagePost,
        timestamp: Timestamp.now(),
      });
      setNewMessagePost("");
      handleOpen();
      window.location.href = '/dashboard/chat';
    }
  };

  const handleNewKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleOfferClick = async (message) => {
    const offerDetails = message.offerDetails || {};
    const orderNumber = Math.floor(100000 + Math.random() * 90000);
  
    // Generate a custom orderId or use orderNumber as the ID (adjust as needed)
    const orderId = `order_${orderNumber}`;
  
    const orderData = {
      title: offerDetails.title || "",
      deliveryTime: offerDetails.deliveryTime || "",
      revisions: offerDetails.revisions || "",
      price: offerDetails.price || "",
      service: offerDetails.service || "",
      description: offerDetails.description || "",
      RecruiterEmail: dbUser.email,
      FreelancerEmail: selectedChat.email,
      timestamp: new Date(),
      orderNumber: orderNumber,
      status: "Pending",
      img: selectedChat.img,
    };
  
    try {
      // Use setDoc with doc to specify the orderId as the document ID
      await setDoc(doc(db, "orders", orderId), orderData);
      console.log("Order saved successfully");
  
      // Set offer as accepted and show success message
      setAcceptedOffer(message.timestamp);
      setShowMessage(true);
  
      // Hide message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error("Error saving order: ", error);
    }
  };

  useEffect(() => {
    if (finalInit) {
      if (recruiter) {
        handleOpen();
      } else {
        setSelectedChat(uniqueUsersList[0]);
      }
    }
  }, [finalInit]);

  useEffect(() => {
    if (initalized) {
      try {
        const q = query(collection(db, "users"), where("email", "in", uniqueChatList), where("email", "!=", dbUser.email), orderBy("createdAt"));
        const unsubscribe2 = onSnapshot(q, (snapshot) => {
          setUniqueUsersList(snapshot.docs.map((doc) => doc.data()));
          setFinalInit(true);
        });
        return () => unsubscribe2();
      } catch (err) {
        console.log(err);
        setFinalInit(true);
        return;
      }
    }
  }, [initalized]);

  useEffect(() => {
    if (!dbUser) return;
    const q = query(collection(db, "messages"), or(where("from", "==", dbUser.email), where("to", "==", dbUser.email)), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.flatMap((doc) => {
        const data = doc.data();
        return [data.from, data.to];
      });
      setUniqueChatList([...new Set(chatList)]);
      setInitialized(true);
      const urlParams = new URLSearchParams(window.location.search);
      setRecruiter(urlParams.get("reference"));
      setJobTitle(decodeURI(urlParams.get("job")));
    });
    return () => unsubscribe();
  }, [dbUser]);

  useEffect(() => {
    if (!selectedChat) return;

    const q1 = query(collection(db, "messages"), where("from", "==", dbUser.email), where("to", "==", selectedChat.email), orderBy("timestamp"));
    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      setMessages1(snapshot.docs.map((doc) => doc.data()));
    });

    const q2 = query(collection(db, "messages"), where("from", "==", selectedChat.email), where("to", "==", dbUser.email), orderBy("timestamp"));
    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      setMessages2(snapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
      setMessagesReceived(true);
    };
  }, [selectedChat]);

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
    <div className="flex" style={{ height: "calc(100vh - 100px" }}>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody>
          <form onSubmit={handleNewSendMessage} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-4">
              {recruiter && (
                <Typography variant="regular" color="blue-gray" className="font-medium">
                  Applying for {jobTitle ? jobTitle : null}
                </Typography>
              )}
              <Input
                size="lg"
                placeholder="name@mail.com"
                className="border border-gray-300 rounded-md mt-2"
                value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Add a message
              </Typography>
              <div className="flex items-center">
                <Input
                  type="text"
                  value={newMessagePost}
                  onChange={(e) => setNewMessagePost(e.target.value)}
                  onKeyPress={handleNewKeyPress}
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
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto" style={{ height: "calc(100vh - 120px" }}>
        <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search chats..."
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            className="w-full"
          />
          {/* <Button onClick={handleOpen} variant="gradient">
            <PlusIcon className="h-4 w-8" />
          </Button> */}
        </div>
        {filteredChats && filteredChats.map((chat) => (
          <div key={chat.displayName}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100`}
            onClick={() => setSelectedChat(chat)}>
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
      <div className="flex-1 bg-gray-100 p-4  bg-white">
        {selectedChat ? (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <Avatar src={selectedChat.img} alt={selectedChat.displayName} size="sm" variant="rounded" />
                <Typography variant="h5" color="blue-gray" className="font-medium">
                  {selectedChat.displayName}
                </Typography>
              </div>
            </div>

            <div className="mb-4">
            {messages3.map((message) => (
        <div key={message.timestamp} className={`flex ${message.from === dbUser.email ? "justify-end" : ""} mb-4`}>
          <div className={`flex flex-col ${message.from === dbUser.email ? "items-end" : "items-start"}`}>
            <Typography variant="small" color="blue-gray" className="font-semibold">
              {message.from}
            </Typography>
            <Typography className="bg-blue-100 p-2 rounded-md text-blue-gray-800">
              {message.text}
            </Typography>

            {/* Offer details section */}
            {message.offerDetails && (
              <div className="mt-4 w-full p-6 bg-white shadow-lg rounded-xl border border-gray-300">
                <Typography variant="h6" color="blue-gray" className="font-semibold mb-2">
                  Offer Details:
                </Typography>

                <div className="mb-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">Title:</Typography>
                  <Typography className="text-lg font-bold">{message.offerDetails.title}</Typography>
                </div>

                {/* Inline flex container for Delivery Time, Revision Offered, and Amount */}
                <div className="mb-2 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Typography variant="small" color="blue-gray" className="font-medium">Delivery Time (ndays):</Typography>
                    <Typography className="text-lg font-bold ml-2">{message.offerDetails.deliveryTime}</Typography>
                  </div>

                  <div className="flex items-center">
                    <Typography variant="small" color="blue-gray" className="font-medium">Revision Offered:</Typography>
                    <Typography className="text-lg font-bold ml-2">{message.offerDetails.revisions}</Typography>
                  </div>

                  <div className="flex items-center">
                    <Typography variant="small" color="blue-gray" className="font-medium">Amount:</Typography>
                    <Typography className="text-lg font-bold ml-2">{message.offerDetails.price}</Typography>
                  </div>
                </div>

                <div className="mb-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">Additional Service:</Typography>
                  <Typography className="text-base">{message.offerDetails.service}</Typography>
                </div>

                <div className="mb-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">Description:</Typography>
                  <Typography className="text-base">{message.offerDetails.description}</Typography>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button
                    onClick={() => handleOfferClick(message)}
                    size="sm"
                    variant="gradient"
                    color="green"
                    disabled={acceptedOffer === message.timestamp}
                  >
                    {acceptedOffer === message.timestamp ? "Offer Accepted" : "Accept Offer"}
                  </Button>
                  <Button size="sm" variant="text" color="red">
                    Decline
                  </Button>
                </div>
              </div>
            )}
            <Typography variant="small" className="text-blue-gray-500">
              {message.timestamp.toDate().toUTCString()}
            </Typography>
          </div>
        </div>
      ))}

      {/* Success message animation */}
      {showMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-green-500 text-white rounded-lg animate-fade-in-center">
          Offer accepted
        </div>
      )}
            </div>


            <div className="flex items-center gap-4">
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
        ) : (
          <Typography variant="h6" color="blue-gray">
            Select a chat to start messaging
          </Typography>
        )}
      </div>
    </div>

  );
}

export default Chat;