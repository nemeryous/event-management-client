import React, { useEffect, useState, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { setUser, setToken, clearToken } from "@store/slices/authSlice";
import Loading from "@components/common/Loading";
import { useGetAuthUserQuery, useRefreshTokenMutation } from "@api/authApi";
import { rootApi } from "@api/rootApi";

const ProtectedRoute = memo(() => {
  const dispatch = useDispatch();
  const { accessToken, user: currentUser } = useSelector((state) => state.auth);

  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);

  const shouldFetchUser = accessToken && !currentUser;

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    error: userError,
  } = useGetAuthUserQuery(undefined, {
    skip: !shouldFetchUser,
  });

  const [
    refreshToken,
    { isLoading: isRefreshLoading, isError: isRefreshError },
  ] = useRefreshTokenMutation();

  const handleRefreshToken = useCallback(async () => {
    if (!accessToken && !hasAttemptedRefresh) {
      setHasAttemptedRefresh(true);
      try {
        const tokenData = await refreshToken().unwrap();
        dispatch(setToken(tokenData));
      } catch (err) {
        console.error("Token refresh failed:", err);
        dispatch(clearToken());
      }
    }
  }, [accessToken, hasAttemptedRefresh, refreshToken, dispatch]);

  useEffect(() => {
    handleRefreshToken();
  }, [handleRefreshToken]);

  useEffect(() => {
    if (isUserSuccess && user) {
      if (!currentUser || currentUser.id !== user.id) {
        dispatch(setUser(user));
        dispatch(
          rootApi.util.invalidateTags([
            "AllEvents",
            "AllManagedEvents",
            "Events",
            "ManagedEvents",
          ]),
        );
      }
    }
  }, [isUserSuccess, user, currentUser, dispatch]);

  useEffect(() => {
    if (userError && (userError.status === 401 || userError.status === 403)) {
      dispatch(clearToken());
      dispatch(rootApi.util.resetApiState());
    }
  }, [userError, dispatch]);

  const isAuthenticating =
    (!accessToken && !hasAttemptedRefresh) || isRefreshLoading;
  const isLoading = isAuthenticating || (shouldFetchUser && isUserLoading);

  if (isLoading) {
    return <Loading message={"Đang xác thực..."} />;
  }

  if (!accessToken || isRefreshError) {
    return <Navigate to="/login" replace />;
  }

  // const isAdmin = user?.roles?.some((role) => role.roleName === "ROLE_ADMIN");

  // if (isAdmin) {
  //   return <Navigate to="/admin/events" replace />;
  // }

  return <Outlet />;
});

export default ProtectedRoute;
