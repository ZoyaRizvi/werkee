import { createBrowserRouter,} 
  from "react-router-dom";
//import App from "../App";
//import Home from "../assets/Pages/Home";
import Home from "./Home";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard/>,
      children:[
        {path:"/",element:<Home/>},
      ]
    },
  ]);
  export default router