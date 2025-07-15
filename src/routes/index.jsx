import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import { createBrowserRouter } from "react-router-dom";
import EventManagement from "@pages/admin/EventManagement";
import EventDetail from "@pages/admin/EventDetail";
import EventCreate from "@pages/admin/EventCreate";
import Dashboard from "@pages/admin/Dashboard";

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
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <div>Dashboard</div>,
      },
      {
        path: "/event/:id",
        element: <div>Event Detail</div>,
      },
      {
        path: "/qr",
        element: <div>QR Page</div>,
      },
      {
        path: "/poll-analytics",
        element: <div>Poll Analytics</div>,
      },
      {
        path: "/polls",
        element: <div>Polls</div>,
      },
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
    ],
  },
]);

export default router;
