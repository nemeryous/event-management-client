import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import AdminLayout from "@layouts/AdminLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import AttendantList from "../pages/admin/AttendantList.jsx";
import NotFound from "../pages/NotFound.jsx";
import AnswerQuestion from "../pages/AnswerQuestion.jsx";
import PollPage from "@pages/poll/PollPage";
import QRPage from "@pages/qr/QRPage";
import DashboardUser from "@pages/user/DashboardUser";
import { createBrowserRouter } from "react-router-dom";
import EventManagement from "@pages/admin/EventManagement";
import EventDetail from "@pages/admin/EventDetail";
import EventCreate from "@pages/admin/EventCreate";
import Dashboard from "@pages/admin/Dashboard";
import UserManagement from "@pages/admin/UserManagement";
import CreatePoll from "@pages/poll/CreatePoll.jsx";

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
        element: <EventDetail />,
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
    ],
  },
]);

export default router;
