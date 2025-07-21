import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useGetAuthUserQuery, useRefreshTokenMutation } from "@api/rootApi";
import { setUser, setToken, clearToken } from "@store/slices/authSlice";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetAuthUserQuery(undefined, {
    skip: !accessToken,
  });
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    if (!accessToken) {
      // Nếu không có accessToken, thử refresh token
      refreshToken()
        .unwrap()
        .then((data) => {
          dispatch(setToken(data));
          refetch();
        })
        .catch(() => {
          dispatch(clearToken());
        });
    }
  }, [accessToken, dispatch, refreshToken, refetch]);

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  if (isLoading) return <div>Đang xác thực...</div>;
  if (isError || !accessToken) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
