import React, { useEffect, useState, createContext, useContext } from "react";
import {
  Avatar,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where, getDocs } from "firebase/firestore";
// import { useAuth } from '../../context/authContext/';

// use props to pass finished state
export function NewChat(props, {handleOpen}) {
//   const { userLoggedIn, dbUser } = useAuth(); // Assuming useAuth provides user role
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState(props.recruiter ? props.recruiter : "");

  const [initalized, setInitialized] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // await addDoc(collection(db, 'messages'), {
      //   from: userEmail,
      //   to: userEmail,
      //   text: newMessage,
      //   timestamp: Timestamp.now(),
      // });
      setNewMessage("");
    }
    console.log('hi')
    handleOpen()
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
      // handleOpen()
    }
  };
  
  // useEffect(() => {
  //   console.log(props.recruiter)
  // }, [])

  return (
    <form onSubmit={handleSendMessage} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
        {/* Select User to send message to */}
        <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="font-medium">Email of recipient</Typography>
            <Input
                size="lg"
                placeholder="name@mail.com"
                className="border border-gray-300 rounded-md mt-2"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
            />
        </div>

        {/* Chat Window */}
        <div className="mb-4">
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
    </form>
  );
}

export default NewChat;