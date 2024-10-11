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
import AdminReviewHistory from './pages/Admin/ReviewHistory';
import Forgot from './pages/Authentication/Forgot';

import Course from './pages/User/Course';
import Roadmap from './pages/User/Roadmap';
import Profile from './pages/User/Profile';
import Resource from './pages/User/Resource';
import Wallet from './pages/User/Wallet';
import Approval from './pages/Reviewer/Approval';
import ReviewerPrivateRoute from './components/PrivateRoute/ReviewerPrivateRoute';

import ReviewerDashboard from './pages/Reviewer/Dashboard';
import ReviewerReview from './pages/Reviewer/Review';

import User from './pages/Admin/User';
import Approvals from './pages/Admin/Approvals';
import Blog from './pages/User/Blog';
import ManageBlog from './pages/User/ManageBlog';
import ManageCourse from './pages/User/ManageCourse';
import Payments from './pages/Admin/Payments';
import Chat from './pages/User/Chat';
import Withdrawals from './pages/Admin/Withdrawals';
import Review from './pages/User/Review';
import Notification from './pages/User/Notification';
import VideoChat from './pages/User/VideoChat';
import { AuthPath, AdminPath, UserPath, ReviewerPath } from './types/pathNames';
import ReviewHistory from './pages/User/ReviewHistory';
import Recording from './pages/Admin/Recording';

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
        path: AuthPath.signin,
        element: <AuthPrivateRoute Component={Login} />,
        loader: tokenVerifier,
      },
      {
        path: AuthPath.signup,
        element: <AuthPrivateRoute Component={Signup} />,
        loader: tokenVerifier,
      },
      {
        path: AuthPath.forgot,
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
        path: AdminPath.admindashboard,
        element: <AdminPrivateRoute Component={AdminDashboard} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.admincourses,
        element: <AdminPrivateRoute Component={AdminCourse} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminroadmap,
        element: <AdminPrivateRoute Component={AdminRoadmap} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminchapter,
        element: <AdminPrivateRoute Component={AdminChapter} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminresource,
        element: <AdminPrivateRoute Component={AdminResource} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminusers,
        element: <AdminPrivateRoute Component={User} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminapprovals,
        element: <AdminPrivateRoute Component={Approvals} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminblog,
        element: <AdminPrivateRoute Component={Blog} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminpayments,
        element: <AdminPrivateRoute Component={Payments} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminchat,
        element: <AdminPrivateRoute Component={AdminChat} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminwithdrawals,
        element: <AdminPrivateRoute Component={Withdrawals} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminreviewhistory,
        element: <AdminPrivateRoute Component={AdminReviewHistory} />,
        loader: tokenVerifier,
      },
      {
        path: AdminPath.adminreviewrecording,
        element: <AdminPrivateRoute Component={Recording} />,
        loader: tokenVerifier,
      },
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
        path: UserPath.userdashboard,
        element: <UserPrivateRoute Component={Dashboard} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.usercourses,
        element: <UserPrivateRoute Component={Course} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userroadmap,
        element: <UserPrivateRoute Component={Roadmap} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userprofile,
        element: <UserPrivateRoute Component={Profile} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userresource,
        element: <UserPrivateRoute Component={Resource} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userwallet,
        element: <UserPrivateRoute Component={Wallet} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userblog,
        element: <UserPrivateRoute Component={Blog} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userblogmanage,
        element: <UserPrivateRoute Component={ManageBlog} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userenrolled,
        element: <UserPrivateRoute Component={ManageCourse} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userchat,
        element: <UserPrivateRoute Component={Chat} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userreview,
        element: <UserPrivateRoute Component={Review} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.usernotifications,
        element: <UserPrivateRoute Component={Notification} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.uservideochat,
        element: <UserPrivateRoute Component={VideoChat} />,
        loader: tokenVerifier,
      },
      {
        path: UserPath.userreviewhistory,
        element: <UserPrivateRoute Component={ReviewHistory} />,
        loader: tokenVerifier,
      },
    ],
  },
  {
    path: '/reviewer',
    element: <ReviewerPrivateRoute Component={SideBar} />,
    loader: tokenVerifier, // Use loader for asynchronous data fetching
    errorElement: <ErrorElement />,
    children: [
      {
        path: ReviewerPath.reviewerdashboard,
        element: <ReviewerPrivateRoute Component={ReviewerDashboard} />,
        loader: tokenVerifier,
      },
      {
        path: ReviewerPath.reviewerapproval,
        element: <ReviewerPrivateRoute Component={Approval} />,
        loader: tokenVerifier,
      },
      {
        path: ReviewerPath.reviewerreview,
        element: <ReviewerPrivateRoute Component={ReviewerReview} />,
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
