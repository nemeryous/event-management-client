import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import DashboardUser from "@pages/user/DashboardUser";
import EventDetail from "@pages/user/EventDetail";
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
    path: "/",
    element: <HomePage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardUser />,
          },
          {
            path: "/event/:id",
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
        ],
      },
    ],
  },
]);

export default router;
