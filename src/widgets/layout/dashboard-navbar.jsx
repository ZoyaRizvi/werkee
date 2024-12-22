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
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
export function DashboardNavbar() {
  const { userLoggedIn } = useAuth();
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [user, setUser] = useState(null);

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
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="/public/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="public/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
