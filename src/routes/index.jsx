import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import AttendantList from "../pages/admin/AttendantList.jsx";
import NotFound from "../pages/NotFound.jsx";
import AnswerQuestion from "../pages/AnswerQuestion.jsx";
import PollPage from "@pages/poll/PollPage";
import QRPage from "@pages/qr/QRPage";
import DashboardUser from "@pages/user/DashboardUser";
import EventDetail from "@pages/user/EventDetail";
import { createBrowserRouter } from "react-router-dom";
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
        path: "/qr",
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
]);

export default router;
