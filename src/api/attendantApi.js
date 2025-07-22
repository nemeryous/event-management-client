import { rootApi } from "./rootApi";

export const attendantApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendantsByEvent: builder.query({
      query: (eventId) => `/attendants/get-by-event?eventId=${eventId}`,
    }),
  }),

  overrideExisting: false,
});

export const { useGetAttendantsByEventQuery } = attendantApi;
