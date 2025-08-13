import React from "react";
import { useGetUserNameQuery } from "../../api/authApi";
import { useSelector } from "react-redux";

export default function CreatorName({ userId }) {
  const accessToken = useSelector(state => state.auth.accessToken);
  const tokenType = useSelector(state => state.auth.tokenType);
  
  console.log("CreatorName - userId:", userId);
  console.log("CreatorName - accessToken:", accessToken ? "Có token" : "Không có token");
  console.log("CreatorName - tokenType:", tokenType);
  
  const { data: userName, isLoading, error } = useGetUserNameQuery(userId, {
    skip: !userId || !accessToken, // Skip nếu không có userId hoặc không có token
  });

  console.log("CreatorName - API response:", { userName, isLoading, error });

  if (!accessToken) {
    return <span>ID: {userId} (Chưa đăng nhập)</span>;
  }

  if (isLoading) {
    return <span>Đang tải...</span>;
  }

  if (error) {
    console.error("CreatorName - Error chi tiết:", error);
    // Hiển thị lỗi chi tiết ra UI
    return (
      <span style={{ color: 'red' }}>
        Lỗi lấy tên: {error?.status || ''} {error?.data ? JSON.stringify(error.data) : ''} (ID: {userId})
      </span>
    );
  }

  // Nếu API trả về tên, hiển thị tên, ngược lại hiển thị ID
  const displayName = userName && userName.trim() ? userName : `ID: ${userId}`;
  return <span>{displayName}</span>;
}
