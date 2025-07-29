import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import DashboardUser from "@pages/user/DashboardUser";
import EventDetail from "@pages/user/EventDetail";
import HomePage from "@pages/user/HomePage";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import EventManagement from "@components/user/EventManagement";

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
            element: <EventDetail />,
          },
          {
            path: "/qr",
          },
          {
            path: "/poll-analytics",
          },
          {
            path: "/polls",
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
