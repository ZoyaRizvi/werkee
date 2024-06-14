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

const icon = {
  className: 'w-5 h-5 text-inherit',
};

const sideNavRoutes = (userRole) => {
  if (userRole === 'candidate') {
    return [
      {
        layout: 'candidate',
        pages: [
          {
            icon: <HomeIcon {...icon} />,
            name: 'Home',
            path: '/candidate/home',
            element: <CandidateHome />,
          },
          {
            icon: <UserCircleIcon {...icon} />,
            name: 'Profile',
            path: '/candidate/profile',
            element: <CandidateProfile />,
          },
          {
            icon: <ChatBubbleOvalLeftIcon {...icon} />,
            name: 'Chat',
            path: '/candidate/chat',
            element: <CandidateChat />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: 'Notifications',
            path: '/candidate/notifications',
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
            path: '/dashboard/home',
            element: <DashboardHome />,
          },
          {
            icon: <UserCircleIcon {...icon} />,
            name: 'Profile',
            path: '/dashboard/profile',
            element: <DashboardProfile />,
          },
          {
            icon: <ChatBubbleOvalLeftIcon {...icon} />,
            name: 'Chat',
            path: '/dashboard/chat',
            element: <DashboardChat />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: 'Notifications',
            path: '/dashboard/notifications',
            element: <DashboardNotifications />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: 'Posting',
            path: '/dashboard/posting',
            element: <Posting />,
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
