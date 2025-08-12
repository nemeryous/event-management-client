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
  }),

  overrideExisting: false,
});

export const {
  useGetAttendantsByEventQuery,
  useAddParticipantsMutation,
  useDeleteParticipantsMutation,
  useDeleteParticipantMutation,
  useCheckInEventMutation,
} = attendantApi;
