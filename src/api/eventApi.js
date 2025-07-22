import { rootApi } from "./rootApi";

export const eventApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "/events",
    }),
  }),
  overrideExisting: false,
});

export const { useGetEventsQuery } = eventApi;
