import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";

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
