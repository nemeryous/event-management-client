import { rootApi } from "./rootApi";

const eventListTags = [
  "Events",
  "AllEvents",
  "ManagedEvents",
  "AllManagedEvents",
];

export const eventApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [...eventListTags],
    }),
    updateEvent: builder.mutation({
      query: ({
        eventId,
        title,
        description,
        start_time,
        end_time,
        location,
        url_docs,
        max_participants,
      }) => ({
        url: `/events/${eventId}`,
        body: {
          title,
          description,
          start_time,
          end_time,
          location,
          url_docs,
          max_participants,
        },
        method: "PUT",
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Events", id: eventId },
        ...eventListTags,
      ],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    getEvents: builder.query({
      query: ({
        page = 0,
        size = 6,
        sortBy = "startTime",
        sortDir = "asc",
        status = null,
        search = null,
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sortBy,
          sortDir,
        });

        if (status) params.append("status", status);
        if (search) params.append("search", search);

        return `/events?${params.toString()}`;
      },
      providesTags: ["Events"],
    }),
    getManagedEvents: builder.query({
      query: ({
        page = 0,
        size = 6,
        sortBy = "startTime",
        sortDir = "asc",
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sortBy,
          sortDir,
        });
        return `/events/managed?${params.toString()}`;
      },
      providesTags: ["ManagedEvents"],
    }),
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),
    joinEvent: builder.mutation({
      query: (eventToken) => ({
        url: `/events/join/${eventToken}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Events", id: result?.eventId },
        ...eventListTags,
      ],
    }),
    uploadEventBanner: builder.mutation({
      query: ({ eventId, bannerFile }) => {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return {
          url: `/events/${eventId}/upload-banner`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Events", id: eventId },
        ...eventListTags,
      ],
    }),
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
    getEventManagersByEventId: builder.query({
      query: (eventId) => ({
        url: `/event-manager/event-managers?eventId=${eventId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        return list
          .map((m) => ({
            user_id: m.user_id ?? m.userId ?? m.id ?? m.managerId,
            roleType: m.roleType ?? m.role ?? m.role_type ?? "MANAGE",
          }))
          .filter((m) => m.user_id);
      },
      providesTags: (result, error, eventId) => [
        { type: "EventManager", id: eventId },
      ],
    }),
    uploadEditorImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: "/medias/image-upload",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetManagedEventsQuery,
  useJoinEventMutation,
  useUploadEventBannerMutation,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useAssignEventManagerMutation,
  useRemoveEventManagerMutation,
  useGetEventManagersByEventIdQuery,
  useUploadEditorImageMutation,
} = eventApi;
