// Dashboard.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { IconButton } from '@material-tailwind/react';
import { Sidenav, DashboardNavbar, Configurator } from '@/widgets/layout';
import sideNavRoutes from '../sideNavRoutes.jsx';
import { useMaterialTailwindController, setOpenConfigurator } from '@/context';
import { useAuth } from '../context/authContext/index';

const Dashboard = () => {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { userLoggedIn, userRole } = useAuth(); // Assuming useAuth provides user role

  // Fetch sideNavRoutes based on user role
  const routes = sideNavRoutes(userRole);

  // If user is not logged in, redirect to sign-in page
  if (!userLoggedIn) {
    return <Navigate to={'/auth/sign-in'} replace={true} />;
  }

  // If user role does not match any defined routes, handle appropriately
  if (!routes || routes.length === 0) {
    return <Navigate to={'/404'} replace={true} />;
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes[0].pages} // Assuming routes[0].pages is correct based on sideNavRoutes structure
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
          {routes[0].pages.map(({ path, element }) => (
            <Route exact path={path} element={element} key={path} />
          ))}
        </Routes>
        <div className="text-blue-gray-600">
          {/* Additional content if needed */}
        </div>
      </div>
    </div>
  );
};

Dashboard.displayName = 'Dashboard';

export default Dashboard;
