import {
  HomeIcon,
  UserCircleIcon,
  ChatBubbleOvalLeftIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import {
  Home as DashboardHome,
  Profile as DashboardProfile,
  Chat as DashboardChat,
  Notifications as DashboardNotifications,
} from '@/pages/dashboard';
import {
  Home as CandidateHome,
  Profile as CandidateProfile,
  Chat as CandidateChat,
  Notifications as CandidateNotifications,
} from '@/pages/candidate';

import Posting from './pages/dashboard/posting';

import {
  Home as AdminHome,
 } from '@/pages/admin';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

const sideNavRoutes = (userRole) => {
  if (userRole === 'candidate') {
    return [
      {
        layout: 'dashboard',
        pages: [
          {
            icon: <HomeIcon {...icon} />,
            name: 'Home',
            path: '/home',
            element: <CandidateHome />,
          },
          {
            icon: <UserCircleIcon {...icon} />,
            name: 'Profile',
            path: '/profile',
            element: <CandidateProfile />,
          },
          {
            icon: <ChatBubbleOvalLeftIcon {...icon} />,
            name: 'Chat',
            path: '/chat',
            element: <CandidateChat />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: 'Notifications',
            path: '/notifications',
            element: <CandidateNotifications />,
          },
        ],
      },
    ];
  } else if (userRole === 'recruiter') {
    return [
      {
        layout: 'dashboard',
        pages: [
          {
            icon: <HomeIcon {...icon} />,
            name: 'Dashboard',
            path: '/home',
            element: <DashboardHome />,
          },
          {
            icon: <UserCircleIcon {...icon} />,
            name: 'Profile',
            path: '/profile',
            element: <DashboardProfile />,
          },
          {
            icon: <ChatBubbleOvalLeftIcon {...icon} />,
            name: 'Chat',
            path: '/chat',
            element: <DashboardChat />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: 'Notifications',
            path: '/notifications',
            element: <DashboardNotifications />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: 'Posting',
            path: '/posting',
            element: <Posting />,
          },
        ],
      },
    ];
  } else if (userRole === 'admin') {
    return [
      {
        layout: 'admin',
        pages: [
          {
            icon: <HomeIcon {...icon} />,
            name: 'Home',
            path: '/home',
            element: <AdminHome />,
          },
        ],
      },
    ];
  } else {
    // Default fallback if role is not recognized
    return [];
  }
};

export default sideNavRoutes;
