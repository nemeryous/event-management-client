import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attendantApi = createApi({
  reducerPath: 'attendantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/v1/',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJuaGF0bmd1eWVuQGdtYWlsLmNvbSIsImlhdCI6MTc1Mjk4MDQzOSwiZXhwIjoxNzUyOTgxMzM5fQ.ztdxjET50ZZfW9tYxpFx9BkotEHufhRg6Eaya3Ah9spaT1Duqfh51M-hbLtUL-DJ');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAttendantsByEvent: builder.query({
      query: (eventId) => `attendants?eventId=${eventId}`,
    }),
  }),
});

export const { useGetAttendantsByEventQuery } = attendantApi; 