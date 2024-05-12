import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Landing from './layouts/landing/Landing.jsx';
import { AuthProvider } from "./context/authContext/index.jsx"

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
  ]
  let routesElement= useRoutes(arr)
  return (
    <AuthProvider>
      {routesElement}
    </AuthProvider>
  );
}

export default App;
