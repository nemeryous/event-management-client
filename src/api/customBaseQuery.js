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

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        console.log("Access token hết hạn, đang làm mới...");

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
          console.log("Refresh token thất bại, đăng xuất người dùng.");
          api.dispatch(clearToken());

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
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
