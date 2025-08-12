import { method } from "lodash";
import { rootApi } from "./rootApi";

export const eventApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
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
    }),
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
        "Events",
        "AllEvents",
        "ManagedEvents",
        "AllManagedEvents",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEventsQuery,
  useGetAllEventsQuery,
  useGetManagedEventsQuery,
  useGetAllManagedEventsQuery,
  useGetEventByIdQuery,
  useJoinEventMutation,
  useGetEventQRQuery,
  useUpdateEventMutation
} = eventApi;
