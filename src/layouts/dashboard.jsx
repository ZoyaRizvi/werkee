// Dashboard.jsx

import React, {useEffect, useState} from 'react';
import { Link, Navigate, useNavigate, Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { IconButton } from '@material-tailwind/react';
import { Sidenav, DashboardNavbar, Configurator } from '@/widgets/layout';
import sideNavRoutes from '../sideNavRoutes.jsx';
import { useMaterialTailwindController, setOpenConfigurator } from '@/context';
import { useAuth } from '../context/authContext/index';

const Dashboard = () => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { userLoggedIn, dbUser } = useAuth(); // Assuming useAuth provides user role

  const navigate = useNavigate();
  // const dbUserRole = dbUser.role

  // If user is not logged in, redirect to sign-in page
  if (!userLoggedIn) {
    return <Navigate to={'/auth/sign-in'} replace={true} />
  }

  useEffect(() => {
    // console.log(JSON.stringify(dbUser))
    // console.log(userLoggedIn)
  }, [dbUser])


  return (
    <>
    { dbUser && userLoggedIn ? 
    (    <div className="bg-blue-gray-50/50" style={{height: 'calc(100vh - 100px'}}>
        <Sidenav
          routes={sideNavRoutes(dbUser.role)} // Assuming routes[0].pages is correct based on sideNavRoutes structure
          brandImg={sidenavType === 'dark' ? '/img/logo.png' : '/img/logo-ct-dark.png'}
        />
        <div className="p-4 xl:ml-80">
          <DashboardNavbar />
          <Configurator />
          <IconButton
            size="lg"
            color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </IconButton>
          <Routes>
            {sideNavRoutes(dbUser.role)[0].pages.map(({ path, element }) => (
                <Route exact path={path} element={element} key={path} />
            ))}
          </Routes>
          <div className="text-blue-gray-600">
            {/* Additional content if needed */}
          </div>
        </div>
      </div>) :
      <div>loading</div> }
    </>
  );
};

Dashboard.displayName = 'Dashboard';

export default Dashboard;
