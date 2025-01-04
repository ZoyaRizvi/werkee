import React, { useEffect, useState } from 'react';
import { doSignOut } from '../../firebase/auth';
import { useAuth } from '../../context/authContext/index';
import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { collection,getDoc,doc, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
export function DashboardNavbar() {
  const { userLoggedIn } = useAuth();
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]); 
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = JSON.parse(localStorage.getItem('user')).uid; // Assuming user ID is stored in localStorage
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.error("No such user!");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const currentUserEmail = JSON.parse(localStorage.getItem('user')).email; 
    
        // Reference to the notifications collection
        const notificationsRef = collection(db, "notifications");
    
        // Query to filter notifications where freelancerEmail == currentUserEmail
        const notificationsQuery = query(
          notificationsRef,
          where("Email", "==", currentUserEmail), // Filtering based on freelancerEmail
          // orderBy("timestamp", "desc") // Sorting by timestamp in descending order
        );
    
        // Fetch the notifications
        const notificationsSnapshot = await getDocs(notificationsQuery);
    
        // Map through the fetched documents and create a list of notifications
        const notificationsList = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    
        // Set notifications to state
        setNotifications(notificationsList); // Assuming 'setNotifications' is your state setter
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    if (userLoggedIn) {
      fetchNotifications();
    }
  }, [userLoggedIn]);

  const signOut = async (e) => {
    e.preventDefault();
    doSignOut(e);
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {!userLoggedIn ? (
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="items-center gap-1 px-4 normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              </Button>
            </Link>
          ) : (
            <>
              {user && user.img ? (
                <Avatar
                  src={user.img}
                  alt={user.displayName || user.email}
                  className="h-8 w-8"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-blue-gray-500" />
              )}
              <div className="ml-3"></div>
              <Typography
                style={{ fontSize: '13px', paddingTop: '4px' }}
                variant="small"
                color="blue-gray"
                className="mb-1 font-normal"
              >
                {user ? (user.displayName || user.email) : 'Loading...'}
              </Typography>
              <Link to="/">
                <Button
                  onClick={(e) => {
                    signOut(e).then(
                      localStorage.removeItem("user"),
                      window.location.href = "/auth/sign-in"
                    );
                  }}
                  variant="text"
                  color="blue-gray"
                  className="items-center gap-1 px-4 normal-case hidden xl:flex"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
                </Button>
                <IconButton
                  onClick={(e) => {
                    signOut(e).then(
                      localStorage.removeItem("user"),
                      window.location.href = "/auth/sign-in"
                    );
                  }}
                  variant="text"
                  color="blue-gray"
                  className="xl:hidden"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
              </Link>
            </>
          )}
                  <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              {notifications.length === 0 ? (
                <MenuItem className="flex items-center gap-3">
                  <Typography variant="small" color="blue-gray" className="font-normal">No notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map(notification => (
                  <MenuItem key={notification.id} className="flex items-center gap-3">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                        <strong>{notification.message}</strong>
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
  <ClockIcon className="h-3.5 w-3.5" /> {new Date(notification.timestamp).toLocaleString()}
</Typography>

                    </div>
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
