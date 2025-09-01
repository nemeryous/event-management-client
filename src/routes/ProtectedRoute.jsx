import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { setUser, clearToken } from "@store/slices/authSlice";
import Loading from "@components/common/Loading";
import { useGetAuthUserQuery } from "@api/authApi";
import { rootApi } from "@api/rootApi";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, user: currentUser } = useSelector((state) => state.auth);

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAuthUserQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (isSuccess && user) {
      if (!currentUser || currentUser.id !== user.id) {
        dispatch(setUser(user));
        const isAdmin = user.roles?.some((r) => r.roleName === "ROLE_ADMIN");
        if (isAdmin && location.pathname.startsWith("/dashboard")) {
          navigate("/admin/events", { replace: true });
        }
      }
    }
  }, [isSuccess, user, currentUser, dispatch]);

  useEffect(() => {
    if (isError && error && (error.status === 401 || error.status === 403)) {
      dispatch(clearToken());
      dispatch(rootApi.util.resetApiState());
    }
  }, [isError, error, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <Loading message="Đang tải thông tin người dùng..." />;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default React.memo(ProtectedRoute);
