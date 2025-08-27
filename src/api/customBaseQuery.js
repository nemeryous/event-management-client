import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, setToken } from "@store/slices/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, body }) => {
    const token = getState().auth.accessToken;
    const tokenType = getState().auth.tokenType;

    if (token) {
      const authHeader = `${tokenType} ${token}`;
      headers.set("Authorization", authHeader);
    }

    // Nếu body là FormData thì KHÔNG set Content-Type
    if (body instanceof FormData) {
      // Không set Content-Type, browser sẽ tự động set multipart/form-data
    } else {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  console.log("baseQueryWithReauth - Making request to:", args.url);
  console.log("baseQueryWithReauth - Request args:", args);

  let result = await baseQuery(args, api, extraOptions);

  console.log("baseQueryWithReauth - Response:", result);

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
