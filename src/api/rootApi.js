import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number }) => {
        return {
          url: "/auth/register",
          body: { name, email, password, confirm_password, phone_number },
          method: "POST",
        };
      },
    }),

    login: builder.mutation({
      query: ({ email, password }) => {
        return {
          url: "/auth/login",
          body: { email, password },
          method: "POST",
        };
      },
    }),
    getAuthUser: builder.query({
      query: () => "/auth/auth-user",
      providesTags: ["Auth"],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = rootApi;