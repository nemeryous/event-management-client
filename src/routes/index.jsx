import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";

import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";

import QRPage from "@pages/qr/QRPage";
import DashboardUser from "@pages/user/DashboardUser";
import HomePageUser from "@pages/user/HomePageUser";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@layouts/AdminLayout";
import EventManagement from "@pages/admin/EventManagement";
import EventCreate from "@pages/admin/EventCreate";
import EventDetail from "@pages/admin/EventDetail";
import Dashboard from "@pages/admin/Dashboard";
import UserManagement from "@pages/admin/UserManagement";
import NotFound from "@pages/NotFound";
import PollPage from "@pages/poll/PollPage";
import CreatePoll from "@pages/poll/CreatePoll";
import AttendantList from "@pages/admin/AttendantList";
import AnswerQuestion from "@pages/AnswerQuestion";
import EventDetailUser from "@pages/user/EventDetailUser";
import EventManagementManage from "@pages/user/EventManagementManage";
import CheckinResultPage from "@pages/user/CheckinResultPage";

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
            path: "/events/:id",
            element: <EventDetailUser />,
          },
          {
            path: "/events/:eventId/manage",
            element: <EventManagementManage />,
          },
          {
            path: "/qr/:id",
            element: <QRPage />,
          },
          {
            path: "/poll-analytics",
          },
          {
            path: "/attendants",
            element: <AttendantList />,
          },
          {
            path: "/answer-question",
            element: <AnswerQuestion />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
          {
            path: "/poll",
            element: <PollPage />,
          },
          {
            path: "/create-poll",
            element: <CreatePoll />,
          },
          {
            path: "/events/check-in/:eventToken",
            element: <CheckinResultPage />,
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
            element: <EventDetail />,
          },
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/admin/users",
            element: <UserManagement />,
          },

          {
            path: "/manage-event",
            element: <EventManagement />,
          },
        ],
      },
    ],
  },
]);

export default router;
