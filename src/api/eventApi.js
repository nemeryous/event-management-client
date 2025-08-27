import { rootApi } from "./rootApi";

const eventListTags = [
  "Events",
  "AllEvents",
  "ManagedEvents",
  "AllManagedEvents",
];

export const eventApi = rootApi.injectEndpoints({
  tagTypes: ["Event", "EventManager"],
  endpoints: (builder) => ({
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: "/events",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: [...eventListTags],
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
      query: () => "/events/managed/all",
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
        invalidatesTags: [
          "Events",
          "AllEvents",
          "ManagedEvents",
          "AllManagedEvents",
        ],
      }),
      // query: ({
      //   page = 0,
      //   size = 6,
      //   sortBy = "startTime",
      //   sortDir = "asc",
      //   status = null,
      //   search = null,
      // }) => {
      //   const params = new URLSearchParams({
      //     page: page.toString(),
      //     size: size.toString(),
      //     sortBy,
      //     sortDir,
      //   });

      //   if (status) params.append("status", status);
      //   if (search) params.append("search", search);

      //   return `/events?${params.toString()}`;
      // },
      providesTags: ["Events"],
    }),
    // getAllEvents: builder.query({
    //   query: () => "/events/all",
    //   providesTags: ["AllEvents"],
    // }),
    // getManagedEvents: builder.query({
    //   query: ({
    //     page = 0,
    //     size = 6,
    //     sortBy = "startTime",
    //     sortDir = "asc",
    //   }) => {
    //     const params = new URLSearchParams({
    //       page: page.toString(),
    //       size: size.toString(),
    //       sortBy,
    //       sortDir,
    //     });
    //     return `/events/managed?${params.toString()}`;
    //   },
    //   providesTags: ["ManagedEvents"],
    // }),
    // getAllManagedEvents: builder.query({
    //   query: () => "/events/managed/all",
    //   providesTags: ["AllManagedEvents"],
    // }),
    // getEventById: builder.query({
    //   query: (id) => `/events/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Events", id }],
    // }),
    // joinEvent: builder.mutation({
    //   query: (eventToken) => ({
    //     url: `/events/join/${eventToken}`,
    //     method: "POST",
    //     invalidatesTags: [
    //       "Events",
    //       "AllEvents",
    //       "ManagedEvents",
    //       "AllManagedEvents",
    //     ],
    //   }),
    // }),
    getEventQR: builder.query({
      query: (id) => {
        return {
          url: `/attendants/get-qr-check/${id}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
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
    // createEvent: builder.mutation({
    //   query: ({ data, accessToken }) => ({
    //     url: `/events`,
    //     method: "POST",
    //     body: data, // object thuần
    //     headers: {
    //       "Content-Type": "application/json", // ép Content-Type JSON
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }),
    // }),
    uploadBanner: builder.mutation({
      query: ({ eventId, file, accessToken }) => {
        const formData = new FormData();
        // Kiểm tra đuôi file hợp lệ
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
    }),
    assignEventManager: builder.mutation({
      query: (dto) => ({
        url: "/event-manager/assign-manager",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: (result, error, dto) => [
        { type: "EventManager", id: dto.event_id },
        { type: "Event", id: dto.event_id },
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
      ],
    }),
    getEventManagersByEventId: builder.query({
      query: (eventId) => ({
        url: `/event-manager/event-managers?eventId=${eventId}`,
        method: "GET",
      }),
      providesTags: (result, error, eventId) => [
        { type: "EventManager", id: eventId },
      ],
    }),
    // createEvent: builder.mutation({
    //   query: ({ data, accessToken }) => ({
    //     url: `/events`,
    //     method: "POST",
    //     body: data, // object thuần
    //     headers: {
    //       "Content-Type": "application/json", // ép Content-Type JSON
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }),
    // }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetManagedEventsQuery,
  useGetAllManagedEventsQuery,
  useJoinEventMutation,
  useGetEventQRQuery,
  useUploadEventBannerMutation,
  useGetEventBannerQuery,
  useGetAllEventsQuery,
  useUploadBannerMutation,
  useAssignEventManagerMutation,
  useRemoveEventManagerMutation,
  useGetEventManagersByEventIdQuery,
  useGetEventByIdQuery,
  useDeleteEventMutation,
} = eventApi;
