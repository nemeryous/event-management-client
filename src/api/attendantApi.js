import { fetchEventSource } from "@microsoft/fetch-event-source";
import { rootApi } from "./rootApi";

export const attendantApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendantsByEvent: builder.query({
      query: (eventId) => `attendants?eventId=${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Attendants", id: eventId },
      ],
    }),
    getParticipantsByEvent: builder.query({
      query: (eventId) => `attendants/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Participants", id: eventId },
      ],
      async onCacheEntryAdded(
        eventId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        await cacheDataLoaded;

        const token = getState().auth.accessToken;

        if (!token) {
          console.error("SSE Connection: No token found.");
          return;
        }

        const controller = new AbortController();

        fetchEventSource(
          `${import.meta.env.VITE_BASE_URL}/attendants/events/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,

            onmessage(event) {
              if (event.event === "participant-checked-in") {
                const updatedParticipant = JSON.parse(event.data);
                updateCachedData((draft) => {
                  const participant = draft.find(
                    (p) => p.user.id === updatedParticipant.user.id,
                  );
                  if (participant) {
                    participant.check_in_time =
                      updatedParticipant.check_in_time;
                  }
                });
              }
            },
            onerror(err) {
              console.error("EventSource failed:", err);
              throw err;
            },
          },
        );

        await cacheEntryRemoved;
        controller.abort();
      },
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
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),

    // Delete single attendant
    deleteAttendant: builder.mutation({
      query: ({ userId, eventId }) => ({
        url: "attendants/delete-user",
        method: "DELETE",
        body: { userId, eventId },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),

    // Get event managers for an event
    getEventManagersByEvent: builder.query({
      query: (eventId) => `event-manager/event-managers?eventId=${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "EventManagers", id: eventId },
      ],
    }),

    // Assign event manager (alias for assignManager)
    assignEventManager: builder.mutation({
      query: ({ user_id, event_id, roleType }) => ({
        url: "event-manager/assign-manager",
        method: "POST",
        body: { user_id, event_id, roleType },
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "EventManagers", id: event_id },
        { type: "Events" },
      ],
    }),

    // Remove event manager (alias for removeManager)
    removeEventManager: builder.mutation({
      query: ({ user_id, event_id, roleType }) => ({
        url: "event-manager/remove-manager",
        method: "DELETE",
        body: { user_id, event_id, roleType },
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "EventManagers", id: event_id },
        { type: "Events" },
      ],
    }),

    // Add multiple participants
    addParticipants: builder.mutation({
      query: ({ eventId, emails }) => ({
        url: `events/${eventId}/participants`,
        method: "POST",
        body: { emails },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),

    // Delete multiple participants
    deleteParticipants: builder.mutation({
      query: ({ eventId, emails }) => ({
        url: `events/${eventId}/participants`,
        method: "DELETE",
        body: { emails },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),

    // Delete single participant
    deleteParticipant: builder.mutation({
      query: ({ eventId, userId }) => ({
        url: `attendants/${eventId}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Attendants", id: eventId },
        { type: "Events" },
      ],
    }),

    // Check in to event
    checkInEvent: builder.mutation({
      query: ({ eventToken }) => ({
        url: `attendants/check-in/${eventToken}`,
        method: "POST",
      }),
    }),

    // Assign manager (main implementation)
    assignManager: builder.mutation({
      query: ({ event_id, user_id, roleType }) => ({
        url: `event-manager/assign-manager`,
        method: "POST",
        body: { user_id, roleType, event_id },
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "EventManagers", id: event_id },
        { type: "Events" },
      ],
    }),

    // Remove manager (main implementation)
    removeManager: builder.mutation({
      query: ({ event_id, user_id }) => ({
        url: `event-manager/remove-manager`,
        method: "DELETE",
        body: { user_id, event_id },
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: "EventManagers", id: event_id },
        { type: "Events" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  // Queries
  useGetAttendantsByEventQuery,
  useGetUserByEmailQuery,
  useLazyGetUserByEmailQuery,
  useGetEventManagersByEventQuery,
  useGetParticipantsByEventQuery,

  // Mutations
  useAddAttendantMutation,
  useDeleteAttendantMutation,
  useAddParticipantsMutation,
  useDeleteParticipantsMutation,
  useDeleteParticipantMutation,
  useCheckInEventMutation,
  useAssignEventManagerMutation,
  useRemoveEventManagerMutation,
  useAssignManagerMutation,
  useRemoveManagerMutation,
} = attendantApi;
