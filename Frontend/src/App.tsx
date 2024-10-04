import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import Dashboard from './pages/User/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { useAppDispatch } from './store/hooks';
import { setAuthenticated, setUser } from './store/globalSlice';
import { tokenVerifier } from './helper/tokenVerifier';
import ErrorElement from './Error/ErrorElement';
import Home from './pages/Home';
import SideBar from './components/SideBar';
import AdminSideBar from './components/AdminSideBar';
import AuthPrivateRoute from './components/AuthPrivateRoute';
import UserPrivateRoute from './components/UserPrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import AdminRoadmap from './pages/Admin/Roadmap';
import AdminChapter from './pages/Admin/Chapter';
import AdminCourse from './pages/Admin/Course';
import AdminResource from './pages/Admin/Resource';
import AdminChat from './pages/Admin/Chat';
import Forgot from './pages/Authentication/Forgot';

import Course from './pages/User/Course';
import Roadmap from './pages/User/Roadmap';
import Profile from './pages/User/Profile';
import Resource from './pages/User/Resource';
import Wallet from './pages/User/Wallet';
import Approval from './pages/Reviewer/Approval';
import ReviewerPrivateRoute from './components/PrivateRoute/ReviewerPrivateRoute';

import ReviewerDashboard from './pages/Reviewer/Dashboard';
import User from './pages/Admin/User';
import Approvals from './pages/Admin/Approvals';
import Blog from './pages/User/Blog';
import ManageBlog from './pages/User/ManageBlog';
import ManageCourse from './pages/User/ManageCourse';
import Payments from './pages/Admin/Payments';
import Chat from './pages/User/Chat';
import Withdrawals from './pages/Admin/Withdrawals';
import Review from './pages/User/Review';

const router = createBrowserRouter([
  //authentication routes
  {
    path: '/',
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <AuthPrivateRoute Component={Home} />,
        loader: tokenVerifier,
      },
      {
        path: '/signin',
        element: <AuthPrivateRoute Component={Login} />,
        loader: tokenVerifier,
      },
      {
        path: '/signup',
        element: <AuthPrivateRoute Component={Signup} />,
        loader: tokenVerifier,
      },
      {
        path: '/forgot',
        element: <AuthPrivateRoute Component={Forgot} />,
        loader: tokenVerifier,
      },
    ],
  },
  //admin routes
  {
    path: '/admin',
    element: <AdminPrivateRoute Component={AdminSideBar} />,
    // element:<AdminSideBar/>,
    loader: tokenVerifier,
    errorElement: <ErrorElement />,

    children: [
      {
        path: '/admin/dashboard',
        element: <AdminPrivateRoute Component={AdminDashboard} />,
        loader: tokenVerifier,
      },
      {
        path: '/admin/courses',
        element: <AdminPrivateRoute Component={AdminCourse} />,
        loader: tokenVerifier,
      },
      {
        path: '/admin/roadmap',
        element: <AdminPrivateRoute Component={AdminRoadmap} />,
        loader: tokenVerifier,
      },
      {
        path: '/admin/chapter',
        element: <AdminPrivateRoute Component={AdminChapter} />,
        loader: tokenVerifier,
      },
      {
        path: '/admin/resource',
        element: <AdminPrivateRoute Component={AdminResource} />,
        loader: tokenVerifier,
      },
      {
        path: '/admin/users',
        element: <AdminPrivateRoute Component={User} />,
        loader: tokenVerifier,
      },
      {
        path: '/admin/approvals',
        element: <AdminPrivateRoute Component={Approvals} />,
        loader: tokenVerifier,
      },
      {
        path:'/admin/blog',
        element:<AdminPrivateRoute Component={Blog}/>,
        loader:tokenVerifier
      },
      {
        path:'/admin/payments',
        element:<AdminPrivateRoute Component={Payments}/>,
        loader:tokenVerifier
      },
      {
        path:'/admin/chat',
        element:<AdminPrivateRoute Component={AdminChat}/>,
        loader:tokenVerifier
      },
      {
        path:'/admin/withdrawals',
        element:<AdminPrivateRoute Component={Withdrawals}/>,
        loader:tokenVerifier
      }
    ],
  },
  //user routes
  {
    path: '/user',
    element: <UserPrivateRoute Component={SideBar} />,
    loader: tokenVerifier, // Use loader for asynchronous data fetching
    errorElement: <ErrorElement />,

    children: [
      {
        path: '/user/dashboard',
        element: <UserPrivateRoute Component={Dashboard} />,
        loader: tokenVerifier,
      },
      {
        path: '/user/courses',
        element: <UserPrivateRoute Component={Course} />,
        loader: tokenVerifier,
      },
      {
        path: '/user/roadmap',
        element: <UserPrivateRoute Component={Roadmap} />,
        loader: tokenVerifier,
      },
      {
        path: '/user/profile',
        element: <UserPrivateRoute Component={Profile} />,
        loader: tokenVerifier,
      },
      {
        path: '/user/resource',
        element: <UserPrivateRoute Component={Resource} />,
        loader: tokenVerifier,
      },
      {
        path: '/user/wallet',
        element: <UserPrivateRoute Component={Wallet} />,
        loader: tokenVerifier,
      },
      {
        path:'/user/blog',
        element:<UserPrivateRoute Component={Blog}/>,
        loader:tokenVerifier
      },
      {
        path:'/user/blog/manage',
        element:<UserPrivateRoute Component={ManageBlog}/>,
        loader:tokenVerifier
      },
      {
        path:'/user/enrolled',
        element:<UserPrivateRoute Component={ManageCourse}/>,
        loader:tokenVerifier
      },
      {
        path:'/user/chat',
        element:<UserPrivateRoute Component={Chat}/>,
        loader:tokenVerifier
      },
      {
        path:'/user/review',
        element:<UserPrivateRoute Component={Review}/>,
        loader:tokenVerifier
      }
    ],
  },
  {
    path: '/reviewer',
    element: <ReviewerPrivateRoute Component={SideBar} />,
    loader: tokenVerifier, // Use loader for asynchronous data fetching
    errorElement: <ErrorElement />,
    children: [
      {
        path: '/reviewer/dashboard',
        element: <ReviewerPrivateRoute Component={ReviewerDashboard} />,
        loader: tokenVerifier,
      },
      {
        path: '/reviewer/approval',
        element: <ReviewerPrivateRoute Component={Approval} />,
        loader: tokenVerifier,
      },
    ],
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = async () => {
    const data = await tokenVerifier();
    if (data) {
      dispatch(setAuthenticated());
      dispatch(setUser(data));
    }
  };
  authState();
  return <RouterProvider router={router} />;
};

export default App;
