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
        url: `/events/delete/${id}`,
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
    getAllEvents: builder.query({
      query: () => "/events/all",
      providesTags: ["AllEvents"],
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
    getAllManagedEvents: builder.query({
      query: () => "/events/man foroaged/all",
      providesTags: ["AllManagedEvents"],
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
      invalidatesTags: (result, error, arg) => [
        { type: "Events", id: result?.eventId },
        ...eventListTags,
      ],
    }),
    getEventQR: builder.query({
      query: (id) => ({
        url: `/attendants/get-qr-check/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
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
    uploadBanner: builder.mutation({
      query: ({ eventId, file, accessToken }) => {
        const formData = new FormData();
        const allowedExt = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
        const ext = file.name.split(".").pop().toLowerCase();
        if (!allowedExt.includes(ext)) {
          throw new Error(
            "File banner phải là ảnh (png, jpg, jpeg, gif, webp, svg)",
          );
        }
        formData.append("banner", file);
        return {
          url: `/events/${eventId}/upload-banner`,
          method: "PUT",
          body: formData,
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        };
      },
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Events", id: eventId },
        ...eventListTags,
      ],
    }),

    removeEventManager: builder.mutation({
      query: (dto) => ({
        url: "/event-manager/remove-manager",
        method: "DELETE",
        body: dto,
      }),
      invalidatesTags: (result, error, dto) => [
        { type: "EventManager", id: dto.event_id },
        { type: "Event", id: dto.event_id },
        ...eventListTags,
      ],
      async onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patchManagers = dispatch(
          rootApi.util.updateQueryData(
            "getEventManagersByEventId",
            dto.event_id,
            (draft) => {
              try {
                if (!Array.isArray(draft)) return;
                const idx = draft.findIndex(
                  (m) => String(m.user_id) === String(dto.user_id),
                );
                if (idx !== -1) draft.splice(idx, 1);
              } catch (_) {
                // no-op
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch (_) {
          patchManagers.undo();
        }
      },
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
  }),
  overrideExisting: false,
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetAllEventsQuery,
  useGetManagedEventsQuery,
  useGetAllManagedEventsQuery,
  useJoinEventMutation,
  useGetEventQRQuery,
  useUploadEventBannerMutation,
  useUploadBannerMutation,
  useRemoveEventManagerMutation,
  useGetEventManagersByEventIdQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
