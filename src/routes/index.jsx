import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import AdminLayout from "@layouts/AdminLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import NotFound from "../pages/NotFound.jsx";
import PollPageUser from "@pages/user/PollPageUser";
import QRPage from "@pages/qr/QRPage";
import DashboardUser from "@pages/user/DashboardUser";
import HomePageUser from "@pages/user/HomePageUser.jsx";
import EventDetailUser from "@pages/user/EventDetailUser";

import { createBrowserRouter } from "react-router-dom";
import EventManagement from "@pages/admin/EventManagement";
import EventCreate from "@pages/admin/EventCreate";
import Dashboard from "@pages/admin/Dashboard";
import UserManagement from "@pages/admin/UserManagement";
import CreatePoll from "@pages/poll/CreatePoll.jsx";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <HomePageUser />,
          },
          {
            path: "/dashboard",
            element: <DashboardUser />,
          },
          {
            path: "/event/:id",
            element: <EventDetailUser />,
          },
          {
            path: "/qr/:id",
            element: <QRPage />,
          },
          {
            path: "/poll-analytics",
          },
          {
            path: "*",
            element: <NotFound />,
          },
          {
            path: "/poll/:pollId",
            element: <PollPageUser />,
          },
          {
            path: "/create-poll",
            element: <CreatePoll />,
          },
        ],
      },
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/events",
            element: <EventManagement />,
          },
          {
            path: "/admin/events/create",
            element: <EventCreate />,
          },
          {
            path: "/admin/events/:id",
            // element: <EventDetail />,
          },
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/admin/users",
            element: <UserManagement />,
          },
        ],
      },
    ],
  },
]);

export default router;