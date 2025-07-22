import { rootApi } from "./rootApi";

export const eventApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "/events",
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
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
    }),
  }),

  overrideExisting: false,
});

export const { useGetEventsQuery, useGetEventQRQuery, useGetEventByIdQuery } = eventApi;
