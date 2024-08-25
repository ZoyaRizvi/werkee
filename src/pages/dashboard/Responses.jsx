import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { collection, getDocs, deleteDoc, doc, addDoc, Timestamp } from "firebase/firestore";
import { Input, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { db } from "@/firebase/firebase"; // Adjust the path as necessary
import { getAuth } from "firebase/auth";

export default function Responses() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [newMessagePost, setNewMessagePost] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) {
        console.error("No user is currently signed in.");
        return;
      }

      try {
        const recruiterDocRef = collection(db, 'JobResponses', currentUser.uid, 'applications');
        const querySnapshot = await getDocs(recruiterDocRef);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications: ", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'JobResponses', currentUser.uid, 'applications', id));
      setApplications(applications.filter(application => application.id !== id));
    } catch (error) {
      console.error("Error deleting application: ", error);
    }
  };

  const handleOpen = (email) => {
    setSelectedEmail(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async () => {
    if (newMessagePost.trim()) {
      try {
        await addDoc(collection(db, 'messages'), {
          from: currentUser.email, // Ensure you have the current user's email
          to: selectedEmail,
          users: [currentUser.email, selectedEmail],
          text: newMessagePost,
          timestamp: Timestamp.now(),
        });
        setNewMessagePost("");
        handleClose(); // Close the dialog after sending the message
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Latest Responses
          </Typography>
        </div>
        <div className="divide-y divide-gray-200">
          {applications.map(({ id, name, email, jobTitle, resume, coverLetter }, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-x-3">
                <div className="flex flex-col">
                  <Typography color="blue-gray" variant="h6">
                    {name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {email}
                  </Typography>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <Typography variant="small" color="blue-gray">
                      Project Title: <b>{jobTitle}</b>
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" color="black">
                      {coverLetter}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" color="blue">
                      <a href={resume} download className="text-blue-500">
                        Download Resume
                      </a>
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <Button variant="outlined" color="red" size="sm" onClick={() => handleDelete(id)}>
                  Reject
                </Button>
                <Button onClick={() => handleOpen(email)} variant="outlined" size="small">
                  Message Candidate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
      <Dialog open={open} handler={handleClose}>
        <DialogBody>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Send a message to {selectedEmail}
              </Typography>
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
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose} className="mr-1">
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
