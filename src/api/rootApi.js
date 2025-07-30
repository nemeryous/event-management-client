import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Events",
    "AllEvents",
    "ManagedEvents",
    "AllManagedEvents",
  ],
  endpoints: () => ({}),
});
