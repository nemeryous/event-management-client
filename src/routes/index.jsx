import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";

import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";

import QRPage from "@pages/qr/QRPage";
import DashboardUser from "@pages/user/DashboardUser";
import HomePage from "@pages/user/HomePage";
import { createBrowserRouter } from "react-router-dom";

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
            element: <HomePage />,
          },
          {
            path: "/dashboard",
            element: <DashboardUser />,
          },
          {
            path: "/events/:id",
            // element: <EventDetail />,
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
