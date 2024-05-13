import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Landing from './layouts/landing/Landing.jsx';
import { AuthProvider } from "./context/authContext/index.jsx"

function App() {
  //   {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
  const routes = [
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
  let routesElement= useRoutes(routes)
  return (
    <AuthProvider>
      {routesElement}
    </AuthProvider>
  );
}

export default App;
