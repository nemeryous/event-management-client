import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1/',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJuaGF0bmd1eWVuNDM2OUBnbWFpbC5jb20iLCJpYXQiOjE3NTMxOTEyODYsImV4cCI6MTc1MzE5MjE4Nn0.Qt73pdTh_LXfbANW_SCCfc2H7Ol1ztXHl70tMGDqgcLJPJRKCEFtTc1_fwSJJoXc');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number }) => ({
        url: "/auth/register",
        body: { name, email, password, confirm_password, phone_number },
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
  useGetAttendantsByEventQuery,
  useGetUserByEmailQuery,
  useLazyGetUserByEmailQuery,
  useAddAttendantMutation,
  useDeleteAttendantMutation,
  useGetEventManagersByEventQuery,
  useAssignEventManagerMutation,
} = rootApi;