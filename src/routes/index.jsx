import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import DashboardUser from "@pages/user/DashboardUser";
import { createBrowserRouter } from "react-router-dom";

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
        element: <DashboardUser />,
      },
      {
        path: "/event/:id",
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
]);

export default router;
