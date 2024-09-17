import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { useAppDispatch } from "./store/hooks";
import { setAuthenticated, setUser } from "./store/globalSlice";
import { tokenVerifier } from "./helper/tokenVerifier";
import ErrorElement from "./Error/ErrorElement";
import Home from "./pages/Home";
import SideBar from "./components/SideBar";
import AdminSideBar from "./components/AdminSideBar";
import AuthPrivateRoute from "./components/AuthPrivateRoute";
import UserPrivateRoute from "./components/UserPrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AdminRoadmap from "./pages/Admin/Roadmap"
import AdminChapter from "./pages/Admin/Chapter"
import AdminCourse from "./pages/Admin/Course";
import AdminResource from "./pages/Admin/Resource"

import Forgot from "./pages/Authentication/Forgot";

import Course from "./pages/User/Course";
import Roadmap from "./pages/User/Roadmap";
import Profile from "./pages/User/Profile";
const router = createBrowserRouter([
  //authentication routes
  {
    path: '/',
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        // element:<Home/>,
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
        path:'/admin/resource',
        element:<AdminPrivateRoute Component={AdminResource}/>,
        loader:tokenVerifier
      }
    ],
  },
  //user routes
  {
    path: '/user',
    element: <UserPrivateRoute Component={SideBar} />,
    loader: tokenVerifier, // Use loader for asynchronous data fetching
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
