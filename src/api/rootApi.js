import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: ({ name, email, password, confirm_password, phone_number }) => {
          return {
            url: "/auth/register",
            body: { name, email, password, confirm_password, phone_number },
            method: "POST",
          };
        },
      }),
    };
  },
});

export const { useRegisterMutation } = rootApi;
