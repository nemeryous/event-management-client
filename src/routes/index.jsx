import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import AttendantList from "../pages/admin/AttendantList.jsx";
import NotFound from "../pages/NotFound.jsx";
import AnswerQuestion from "../pages/AnswerQuestion.jsx";
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
      {
        path: "/attendants",
        element: <AttendantList />,
      },
      {
        path: "/answer-question",
        element: <AnswerQuestion/>,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },

]);

export default router;
