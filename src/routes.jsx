import {
  HomeIcon,
  UserCircleIcon,
  ChatBubbleOvalLeftIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { Home, Profile, Chat, Notifications } from '@/pages/dashboard';
import { SignIn, SignUp } from '@/pages/auth';
import Posting from './pages/dashboard/posting';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

export const routes = [
  {
    layout: 'dashboard',
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: 'dashboard',
        path: '/home',
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: 'profile',
        path: '/profile',
        element: <Profile />,
      },
      {
        icon: <ChatBubbleOvalLeftIcon {...icon} />,
        name: 'Chat',
        path: '/chat',
        element: <Chat />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: 'notifications',
        path: '/notifications',
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: 'posting',
        path: '/posting',
        element: <Posting />,
      },
    ],
  },
  {
    title: 'auth pages',
    layout: 'auth',
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: 'sign in',
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: 'sign up',
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
