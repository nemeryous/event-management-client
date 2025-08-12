import { rootApi } from "./rootApi";

export const attendantApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendantsByEvent: builder.query({
      query: (eventId) => `/attendants/get-by-event?eventId=${eventId}`,
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
    assignManager: builder.mutation({
      query: ({ event_id, user_id, roleType }) => ({
        url: `/event-manager/assign-manager`,
        method: "POST",
        body: { user_id: user_id, roleType, event_id },
      }),
    }),
    removeManager: builder.mutation({
      query: ({ event_id, user_id }) => ({
        url: `/event-manager/remove-manager`,
        method: "DELETE",
        body: { user_id: user_id, event_id },
      }),
      invalidatesTags: ["Events"],
    }),
    getEventManagers: builder.query({
      query: (eventId) => `/event-manager/event-managers?eventId=${eventId}`,
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
  useAssignManagerMutation,
  useRemoveManagerMutation,
  useGetEventManagersQuery
} = attendantApi;
