import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import HomePageUser from "@pages/user/HomePageUser";
import Loading from "@components/common/Loading";

const Root = () => {
  const { user, accessToken } = useSelector((state) => state.auth);

  if (accessToken && !user) {
    return <Loading message="Đang tải dữ liệu người dùng..." />;
  }

  if (user) {
    const isAdmin = user.roles?.some((role) => role.roleName === "ROLE_ADMIN");

    if (isAdmin) {
      return <Navigate to="/admin/events" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Loading message="Đang khởi tạo ứng dụng..." />;
};

export default Root;
