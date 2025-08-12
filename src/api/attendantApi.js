import { rootApi } from "./rootApi";

export const attendantApi = rootApi.injectEndpoints({
  // prepareHeaders: (headers) => {
  //   headers.set('Authorization', 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJuaGF0bmd1eWVuNDM2OUBnbWFpbC5jb20iLCJpYXQiOjE3NTMyMzk0NjAsImV4cCI6MTc1MzI0MDM2MH0.2Ipd7XcTYIcG-dEY66MXaX3Jh9hSD4BJwn8-KofhLkFbKCieMgA9GwLZCaw-LvX1');
  //   return headers;
  // },
  endpoints: (builder) => ({
    getAttendantsByEvent: builder.query({
      query: (eventId) => `attendants?eventId=${eventId}`,
    }),
    getUserByEmail: builder.query({
      query: (email) => `users/by-email?email=${encodeURIComponent(email)}`,
    }),
    addAttendant: builder.mutation({
      query: ({ userId, eventId }) => ({
        url: "attendants/add-user",
        method: "POST",
        body: { userId, eventId },
      }),
    }),
    deleteAttendant: builder.mutation({
      query: ({ userId, eventId }) => ({
        url: "attendants/delete-user",
        method: "DELETE",
        body: { userId, eventId },
      }),
    }),
    getEventManagersByEvent: builder.query({
      query: (eventId) => `event-manager/event-managers?eventId=${eventId}`,
    }),
    assignEventManager: builder.mutation({
      query: ({ user_id, event_id, roleType }) => ({
        url: "event-manager/assign-manager",
        method: "POST",
        body: { user_id, event_id, roleType },
      }),
    }),
    removeEventManager: builder.mutation({
      query: ({ user_id, event_id, roleType }) => ({
        url: "event-manager/remove-manager",
        method: "DELETE",
        body: { user_id, event_id, roleType },
      }),
    }),
    addParticipants: builder.mutation({
      query: ({ eventId, emails }) => ({
        url: `/events/${eventId}/participants`,
        body: { emails },
        method: "POST",
      }),
      invalidatesTags: ["Events"],
    }),
    deleteParticipants: builder.mutation({
      query: ({ eventId, emails }) => ({
        url: `/events/${eventId}/participants`,
        body: { emails },
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
    deleteParticipant: builder.mutation({
      query: ({ eventId, userId }) => ({
        url: `/attendants/${eventId}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
    checkInEvent: builder.mutation({
      query: ({ eventToken }) => ({
        url: `/attendants/check-in/${eventToken}`,
        method: "POST",
      }),
    }),
  }),

  overrideExisting: false,
});


export const {
    useGetAttendantsByEventQuery,
  useAddParticipantsMutation,
  useDeleteParticipantsMutation,
  useDeleteParticipantMutation,
  useCheckInEventMutation,
  useGetUserByEmailQuery,
  useLazyGetUserByEmailQuery,
  useAddAttendantMutation,
  useDeleteAttendantMutation,
  useGetEventManagersByEventQuery,
  useAssignEventManagerMutation,
  useRemoveEventManagerMutation,
} = attendantApi;
