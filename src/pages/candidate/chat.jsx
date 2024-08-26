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
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, or, getDocs } from "firebase/firestore";
import { useAuth } from '../../context/authContext/';
import CreateOfferForm from "./CreateOfferForm";

export function Chat() {
  const { userLoggedIn, dbUser } = useAuth(); // Assuming useAuth provides user role
  // instant messaging functionality
  const [messages1, setMessages1] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [messages3, setMessages3] = useState([]);
  const [messagesReceived, setMessagesReceived] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // selected chat based off context provider
  const selectedChatContext = createContext(null);
  const [selectedChat, setSelectedChat] = useState(null); // todo set an initial value
  // the "from" list
  const [uniqueChatList, setUniqueChatList] = useState([]);
  const [nonUniqueChatList, setNonUniqueChatList] = useState([]);
  const [uniqueUsersList, setUniqueUsersList] = useState([]);
  const [initalized, setInitialized] = useState(false);
  const [finalInit, setFinalInit] = useState(false);
  // new chat recipient email
  const [recruiter, setRecruiter] = useState(null)
  const [jobTitle, setJobTitle] = useState(null)
  const [newMessagePost, setNewMessagePost] = useState("")

  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: selectedChat.email, // to the selectedChat (uses context provider to re-render)
        users: [dbUser.email, selectedChat.email], // [from, to]
        text: newMessage,
        timestamp: Timestamp.now(),
      });
      setNewMessage("");
    }
  };



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      handleOpen()
      // show some kind of confirmation before returning to home
      window.location.href = '/dashboard/chat'
    }
  };

  const handleNewKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
      // handleOpen()
    }
  };

  // New Chat dialog
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (finalInit) {
      // User has come through postings page
      // e.g. url param = recruiter
      if (recruiter) {
        // Open newChat dialog
        handleOpen()
      } else {
        setSelectedChat(uniqueUsersList[0])
      }
    }
  }, [finalInit])

  // Cross reference users from messages list (uniqueChatList), and return all users | uniqueUsersList

  useEffect(() => {
    if (initalized) {
      // Get users based off associated chats - ensures that current user isn't included
      try {
        const q = query(collection(db, "users"), where("email", "in", uniqueChatList), where("email", "!=", dbUser.email), orderBy("createdAt"))
        const unsubscribe2 = onSnapshot(q, snapshot => {
          // Get only unique chats (since there are multiple messages from the same user)
          setUniqueUsersList(snapshot.docs.map(doc => (doc.data())))
          setFinalInit(true)
        });
        return () => unsubscribe2();
      } catch (err) {
        console.log(err)
        // uniqueChatList showing empty edge case

        setFinalInit(true)
        return
      }
    }
  }, [initalized])

  // Get a unique list of users from your associated messages | uniqueChatList

  useEffect(() => {
    if (!dbUser) return;
    // Get messages where sender and recipient is current user
    const q = query(collection(db, "messages"), or(where("from", "==", dbUser.email), where("to", "==", dbUser.email)), orderBy("timestamp"))
    const unsubscribe = onSnapshot(q, snapshot => {
      const chatList = snapshot.docs.flatMap(doc => {
        const data = doc.data();
        return [data.from, data.to];
      });
      setNonUniqueChatList(chatList);

      // Get only unique chats (since there are multiple messages from the same user)
      setUniqueChatList(
        [...new Set(chatList)]
      )
      // Make sure we initialize in the same block as the snapshot
      setInitialized(true)
      // set the recipient of newChat object if user has been directed from postings page
      const urlParams = new URLSearchParams(window.location.search)
      setRecruiter(urlParams.get('reference'))
      setJobTitle(decodeURI(urlParams.get('job')))
    });
    return () => unsubscribe();
  }, [dbUser]);

  // This is only a test block to see if states work fine
  useEffect(() => {
    if (messagesReceived) {
      console.log(messages1)
      console.log(messages2)
      console.log(messages3)
      console.log(uniqueUsersList)
      console.log(nonUniqueChatList)
      console.log(uniqueChatList)
    }
  }, [messagesReceived])

  // Get selected chat messages

  useEffect(() => {
    if (!selectedChat) return;

    // Example flow: One way
    //
    // from:admin, to:candid
    // admin > candid : hello
    // admin > candid : how are you?

    // Get all messages that have fields from:current user AND to:selectedUser >>>>> Meaning one way messages from sender to recipient
    if (selectedChat) {
      // from sender to recipient
      const q = query(collection(db, "messages"), where("from", "==", dbUser.email), where("to", "==", selectedChat.email), orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, snapshot => {
        setMessages1(snapshot.docs.map(doc => doc.data()));
      })

      // from recipient to sender
      const q2 = query(collection(db, "messages"), where("from", "==", selectedChat.email), where("to", "==", dbUser.email), orderBy("timestamp"))
      const unsubscribe2 = onSnapshot(q2, snapshot => {
        setMessages2(snapshot.docs.map(doc => doc.data()));
        // setMessages1(prevState => ({ ...prevState, t_message2 }))
      })
      return () => { unsubscribe(), unsubscribe2(), setMessagesReceived(true) }
    }
  }, [selectedChat]);

  useEffect(() => {
    const combined = [...messages1, ...messages2];
    combined.sort((a, b) => a.timestamp - b.timestamp);
    setMessages3(combined);
  }, [messages1, messages2])



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
    <div className="flex" style={{ height: 'calc(100vh - 100px' }}>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody>
          {/* passing logged in user as prop for testing */}
          {/* <NewChat recruiter={queryParameters} handleOpen={handleOpen}/> */}
          <form onSubmit={handleNewSendMessage} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            {/* Select User to send message to */}
            <div className="mb-4">
              {recruiter ?
                <Typography variant="regular" color="blue-gray" className="font-medium">Applying for {jobTitle ? jobTitle : null}</Typography>
                :
                <></>}
              <Input
                size="lg"
                placeholder="name@mail.com"
                className="border border-gray-300 rounded-md mt-2"
                value={recruiter}
                onChange={e => setRecruiter(e.target.value)}
              />
            </div>

            {/* Chat Window */}
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">Add a message</Typography>
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
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 120px' }}>
        {/* <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search chats..."
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            className="w-full"
          /> */}
          {/* <PlusIcon className="h-4 w-8" /> */}
          {/* <Button onClick={handleOpen} variant="gradient">
            <PlusIcon className="h-4 w-8" />
          </Button>
        </div> */}
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
              <div className="ml-4">
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  {selectedChat.displayName}
                </Typography>
                <Typography variant="body2" color="blue-gray" className="text-sm">
                  {selectedChat.email}
                </Typography>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
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
                          <Typography variant="small" color="blue-gray" className="font-medium">Delivery Time (in days):</Typography>
                          <Typography className="text-sm  ml-2">{message.offerDetails.deliveryTime}</Typography>
                        </div>

                        <div className="flex items-center">
                          <Typography variant="small" color="blue-gray" className="font-medium">Revision Offered:</Typography>
                          <Typography className="text-sm  ml-2">{message.offerDetails.revisions}</Typography>
                        </div>

                        <div className="flex items-center">
                          <Typography variant="small" color="blue-gray" className="font-medium">Amount:</Typography>
                          <Typography className="text-sm  ml-2">{message.offerDetails.price}</Typography>
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


                    </div>

                  )}
                  <Typography variant="small" className="text-blue-gray-500">
                    {message.timestamp.toDate().toUTCString()}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
          {selectedChat && (
            <div className="border-t border-gray-200 p-4">
              <CreateOfferForm email={selectedChat.email} />

              <div className="flex items-center mb-2">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 rounded-lg mr-4"
                />

                <Button color="teal" onClick={handleSendMessage}>
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
