import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebase"; // Assuming you've set up Firebase properly
import { collection, query, getDocs, where } from "firebase/firestore";
import { useAuth } from "../../context/authContext/";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
   const { dbUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showAlerts, setShowAlerts] = useState({}); // To track visibility of alerts

  // Fetch notifications from Firestore
  const fetchNotifications = async () => {
    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("Email", "==", dbUser.email)); 
      const querySnapshot = await getDocs(q);

      const fetchedNotifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set notifications and show them all initially
      setNotifications(fetchedNotifications);
      const initialAlertsState = fetchedNotifications.reduce((acc, notification) => {
        acc[notification.id] = true;
        return acc;
      }, {});
      setShowAlerts(initialAlertsState);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle alert close action
  const handleClose = (notificationId) => {
    setShowAlerts((prevState) => ({
      ...prevState,
      [notificationId]: false,
    }));
  };

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Notifications
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              open={showAlerts[notification.id]}
              color={notification.color || "blue"} // Use 'color' field or default to 'blue'
              icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
              onClose={() => handleClose(notification.id)}
            >
              {notification.message || "No message available."}
            </Alert>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
