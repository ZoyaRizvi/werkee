import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Landing from './layouts/landing/Landing.jsx';
import { AuthProvider } from "./context/authContext/index.jsx"
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

function App() {
  // <Route path='/' element={<Landing/>}></Route>
  // <Route path="/auth/*" element={<Auth />} />
  // <Route path="/dashboard/*" element={<Dashboard />} />
  //   {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
  const arr = [
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/auth/*",
      element: <Auth />,
    },
    {
      path: "/dashboard/*",
      element: <Dashboard />,
    },
    // {
    //   icon: <ServerStackIcon {...icon} />,
    //   name: "sign in",
    //   path: "/sign-in",
    //   element: <SignIn />,
    // },
    // {
    //   icon: <RectangleStackIcon {...icon} />,
    //   name: "sign up",
    //   path: "/sign-up",
    //   element: <SignUp />,
    // },
  ]
  let routesElement= useRoutes(arr)
  return (
    <AuthProvider>
      {routesElement}
    </AuthProvider>
  );
}

export default App;
