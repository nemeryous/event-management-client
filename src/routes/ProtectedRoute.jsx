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
  const [authState, setAuthState] = useState({
    isChecking: true,
    hasAttemptedRefresh: false,
  });

  const shouldFetchUser = accessToken && !currentUser;

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    isSuccess: userSuccess,
  } = useGetAuthUserQuery(undefined, {
    skip: !shouldFetchUser,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const [refreshToken, { isLoading: refreshLoading, isError: refreshError }] =
    useRefreshTokenMutation();

  const verifyAuth = useCallback(async () => {
    if (accessToken) {
      setAuthState((prev) => ({ ...prev, isChecking: false }));
      return;
    }

    if (authState.hasAttemptedRefresh) {
      setAuthState((prev) => ({ ...prev, isChecking: false }));
      return;
    }

    try {
      setAuthState((prev) => ({ ...prev, hasAttemptedRefresh: true }));
      const result = await refreshToken().unwrap();
      dispatch(setToken(result));
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch(clearToken());
    } finally {
      setAuthState((prev) => ({ ...prev, isChecking: false }));
    }
  }, [accessToken, authState.hasAttemptedRefresh, refreshToken, dispatch]);

  useEffect(() => {
    if (authState.isChecking && !refreshLoading) {
      verifyAuth();
    }
  }, [authState.isChecking, refreshLoading, verifyAuth]);

  useEffect(() => {
    if (userSuccess && user && !currentUser) {
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
  }, [userSuccess, user, currentUser, dispatch]);

  useEffect(() => {
    if (userSuccess && user && currentUser && user.id !== currentUser.id) {
      dispatch(
        rootApi.util.invalidateTags([
          "AllEvents",
          "AllManagedEvents",
          "Events",
          "ManagedEvents",
        ]),
      );
      dispatch(setUser(user));
    }
  }, [userSuccess, user, currentUser, dispatch]);

  useEffect(() => {
    if (userError) {
      if (userError.status === 401 || userError.status === 403) {
        dispatch(clearToken());
        dispatch(rootApi.util.resetApiState());
      }
    }
  }, [userError, dispatch]);

  const isLoading =
    authState.isChecking || refreshLoading || (shouldFetchUser && userLoading);

  const hasAuthError =
    refreshError ||
    (userError && (userError.status === 401 || userError.status === 403));

  if (isLoading) {
    return <Loading message={"Đang xác thực..."} />;
  }

  if (!accessToken || hasAuthError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
});

export default ProtectedRoute;
