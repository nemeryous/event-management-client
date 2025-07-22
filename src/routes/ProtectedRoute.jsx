import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useGetAuthUserQuery, useRefreshTokenMutation } from "@api/rootApi";
import { setUser, setToken, clearToken } from "@store/slices/authSlice";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetAuthUserQuery(undefined, {
    skip: !accessToken,
  });

  const [refreshToken, { isLoading: refreshLoading, isError: refreshError }] =
    useRefreshTokenMutation();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!accessToken) {
        try {
          const result = await refreshToken().unwrap();
          dispatch(setToken(result));
        } catch {
          dispatch(clearToken());
        }
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [accessToken, dispatch, refreshToken]);

  useEffect(() => {
    if (user) dispatch(setUser(user));
    if (userError) dispatch(clearToken());
  }, [user, userError, dispatch]);

  if (isChecking || refreshLoading || userLoading) {
    return <div>Đang xác thực...</div>;
  }

  if (refreshError || userError || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
