import React from 'react';
import { useRoutes } from 'react-router-dom';
import Landing from './layouts/landing/Landing.jsx';
import { AuthProvider } from './context/authContext/index.jsx';
import Dashboard from './layouts/dashboard.jsx';
import Auth from './layouts/auth.jsx';
import SkillAssessment from './pages/candidate/skillassessment.jsx';
import { Freelancers } from './pages/admin/index.js';
import FreelancerProfile from './pages/dashboard/FreelancerProfile.jsx';

function App() {
  const routes = [
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/auth/*',
      element: <Auth />,
    },
    {
      path: '/dashboard/*',
      element: <Dashboard />,
    },
    {
      path: '/skillassessment/*',
      element: <SkillAssessment />,
    },
    {
      path: '/freelancerprofile/*',
      element: <FreelancerProfile />,
    },
    // {
    //   path: '/candidate/*',
    //   element: <CandidateDashboard />,
    // },
    // {
    //   path: '/candidate/*',
    //   element: <Dashboard />,
    // },
  ];

  let routesElement = useRoutes(routes);

  return (
    <AuthProvider>
      {routesElement}
    </AuthProvider>
  );
}

export default App;
