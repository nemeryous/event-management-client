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
    }),
    getAllEvents: builder.query({
      query: () => "/all",
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEventsQuery,
  useGetEventBannerQuery,
  useGetAllEventsQuery,
} = eventApi;
