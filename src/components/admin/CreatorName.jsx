import React from "react";
import { useGetUserNameQuery } from "../../api/authApi";
import { useSelector } from "react-redux";

export default function CreatorName({ userId }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const tokenType = useSelector((state) => state.auth.tokenType);

  const {
    data: userName,
    isLoading,
    error,
  } = useGetUserNameQuery(userId, {
    skip: !userId || !accessToken,
  });

  if (!accessToken) {
    return <span>ID: {userId} (Chưa đăng nhập)</span>;
  }

  if (isLoading) {
    return <span>Đang tải...</span>;
  }

  if (error) {
    return (
      <span style={{ color: "red" }}>
        Lỗi lấy tên: {error?.status || ""}{" "}
        {error?.data ? JSON.stringify(error.data) : ""} (ID: {userId})
      </span>
    );
  }

  const displayName = userName && userName.trim() ? userName : `ID: ${userId}`;
  return <span>{displayName}</span>;
}
