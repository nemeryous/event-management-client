import { rootApi } from "./rootApi";

const eventListTags = [
  "Events",
  "AllEvents",
  "ManagedEvents",
  "AllManagedEvents",
];

export const eventApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: ({ status = null, search = null } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        const qs = params.toString();
        return `/events/all${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response) => {
        const res = response || {};
        const data = res.data ?? res;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.content)) return data.content;
        if (Array.isArray(data?.pagination?.content)) return data.pagination.content;
        return [];
      },
      providesTags: ["AllEvents"],
    }),
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
      transformResponse: (response) => {
        // Normalize various possible backend shapes into a consistent structure
        // Expected output: { pagination: { content, totalPages, totalElements, number, size }, counters }
        const res = response || {};
        const data = res.data ?? res;

        // Try to locate content array
        const content = Array.isArray(data?.pagination?.content)
          ? data.pagination.content
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data)
              ? data
              : [];

        // Determine pagination meta
        const totalPages = data?.pagination?.totalPages ?? data?.totalPages ?? 0;
        const totalElements = data?.pagination?.totalElements ?? data?.totalElements ?? content.length ?? 0;
        const number = data?.pagination?.number ?? data?.number ?? 0;
        const size = data?.pagination?.size ?? data?.size ?? content.length ?? 0;

        const counters = data?.counters ?? res?.counters ?? {};

        return {
          pagination: {
            content,
            totalPages,
            totalElements,
            number,
            size,
          },
          counters,
        };
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
      transformResponse: (response) => {
        const res = response || {};
        const data = res.data ?? res;
        const content = Array.isArray(data?.pagination?.content)
          ? data.pagination.content
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data)
              ? data
              : [];
        const totalPages = data?.pagination?.totalPages ?? data?.totalPages ?? 0;
        const totalElements = data?.pagination?.totalElements ?? data?.totalElements ?? content.length ?? 0;
        const number = data?.pagination?.number ?? data?.number ?? 0;
        const size = data?.pagination?.size ?? data?.size ?? content.length ?? 0;
        return {
          pagination: { content, totalPages, totalElements, number, size },
        };
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
  useGetAllEventsQuery,
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
