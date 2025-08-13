import { rootApi } from "./rootApi";
import debug from 'debug';

const log = debug('app:mutation'); // Namespace for logs

export const eventApi = rootApi.injectEndpoints({
  tagTypes: ['Event', 'EventManager'],
  endpoints: (builder) => ({
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
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
      providesTags: (result) =>
        result?.content
          ? result.content.map((event) => ({ type: 'Event', id: event.id }))
          : [{ type: 'Event', id: 'LIST' }],
    }),
    getAllEvents: builder.query({
      query: () => "/all",
    }),
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: (result) => result ? [{ type: 'Event', id: result.id }] : [],
    }),
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/events/modify/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
      ],
    }),
    uploadBanner: builder.mutation({
      query: ({ eventId, file, accessToken }) => {
        const formData = new FormData();
        // Kiểm tra đuôi file hợp lệ
        const allowedExt = ["png","jpg","jpeg","gif","webp","svg"];
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowedExt.includes(ext)) {
          throw new Error("File banner phải là ảnh (png, jpg, jpeg, gif, webp, svg)");
        }
        formData.append('banner', file);
        return {
          url: `/events/${eventId}/upload-banner`,
          method: 'PUT',
          body: formData,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        };
      },
    }),
    assignEventManager: builder.mutation({
      query: (dto) => ({
        url: '/event-manager/assign-manager',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: (result, error, dto) => [
        { type: 'EventManager', id: dto.event_id },
        { type: 'Event', id: dto.event_id },
      ],
    }),
    removeEventManager: builder.mutation({
      query: (dto) => ({
        url: '/event-manager/remove-manager',
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: (result, error, dto) => [
        { type: 'EventManager', id: dto.event_id },
        { type: 'Event', id: dto.event_id },
      ],
    }),
    getEventManagersByEventId: builder.query({
      query: (eventId) => ({
        url: `/event-manager/event-managers?eventId=${eventId}`,
        method: 'GET',
      }),
      providesTags: (result, error, eventId) => [{ type: 'EventManager', id: eventId }],
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

    createEvent: builder.mutation({
      query: (data) => ({
        url: `/events`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),



  }),
  overrideExisting: false,
});

export const {
  useGetEventsQuery,
  useGetEventBannerQuery,
  useGetAllEventsQuery,
  useUploadBannerMutation,
  useAssignEventManagerMutation,
  useRemoveEventManagerMutation,
  useGetEventManagersByEventIdQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useCreateEventMutation,
} = eventApi;
