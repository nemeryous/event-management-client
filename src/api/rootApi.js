import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  prepareHeaders: (headers) => {
    headers.set('Authorization', 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJuaGF0bmd1eWVuNDM2OUBnbWFpbC5jb20iLCJpYXQiOjE3NTMxOTgyODMsImV4cCI6MTc1MzE5OTE4M30.zBtBImD9JDU3DGWg3zsQGrhujgB2KBEfAVnTJ7JVM-mgSMdn1mqsCY56IAbw31Ra');
    return headers;
  },
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
    getAttendantsByEvent: builder.query({
      query: (eventId) => `attendants?eventId=${eventId}`,
    }),
    getUserByEmail: builder.query({
      query: (email) => `users/by-email?email=${encodeURIComponent(email)}`,
    }),
    addAttendant: builder.mutation({
      query: ({ userId, eventId }) => ({
        url: 'attendants/add-user',
        method: 'POST',
        body: { userId, eventId },
      }),
    }),
    deleteAttendant: builder.mutation({
      query: ({ userId, eventId }) => ({
        url: 'attendants/delete-user',
        method: 'DELETE',
        body: { userId, eventId },
      }),
    }),
    getEventManagersByEvent: builder.query({
      query: (eventId) => `event-manager/event-managers?eventId=${eventId}`,
    }),
    assignEventManager: builder.mutation({
      query: ({ userId, eventId, roleType }) => ({
        url: 'event-manager/assign-manager',
        method: 'POST',
        body: { userId, eventId, roleType },
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
  useGetAttendantsByEventQuery,
  useGetUserByEmailQuery,
  useLazyGetUserByEmailQuery,
  useAddAttendantMutation,
  useDeleteAttendantMutation,
  useGetEventManagersByEventQuery,
  useAssignEventManagerMutation,
} = rootApi;