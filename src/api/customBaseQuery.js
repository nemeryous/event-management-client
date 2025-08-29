import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, setToken } from "@store/slices/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state.auth?.accessToken;
    const tokenType = state.auth?.tokenType || "Bearer";
    if (token) headers.set("Authorization", `${tokenType} ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          api.dispatch(setToken(refreshResult.data));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearToken());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
