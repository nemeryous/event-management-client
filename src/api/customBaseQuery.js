import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, setToken } from "@store/slices/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    const tokenType = getState().auth.tokenType;

    if (token) {
      headers.set("Authorization", `${tokenType} ${token}`);
    }

    return headers;
  },
});

const getUrl = (args) => (typeof args === "string" ? args : args?.url || "");

const SKIP_REFRESH_PATHS = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/register",
];

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const url = getUrl(args);
  let result = await baseQuery(args, api, extraOptions);

  if (!result?.error || result.error.status !== 401) return result;

  const { accessToken } = api.getState().auth || {};
  if (!accessToken) return result;

  if (SKIP_REFRESH_PATHS.some((p) => url.startsWith(p))) {
    return result;
  }

  if (!mutex.isLocked()) {
    const release = await mutex.acquire();
    try {
      const refreshRes = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshRes?.data) {
        api.dispatch(setToken(refreshRes.data));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearToken());
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.replace("/login");
        }
      }
    } finally {
      release();
    }
  } else {
    await mutex.waitForUnlock();
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
