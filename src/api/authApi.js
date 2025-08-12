import { rootApi } from "./rootApi";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number }) => ({
        url: "/auth/register",
        url: "/auth/register",
        body: { name, email, password, confirm_password, phone_number },
        method: "POST",
        method: "POST",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        url: "/auth/login",
        body: { email, password },
        method: "POST",
        method: "POST",
      }),
    }),
    getAuthUser: builder.query({
      query: () => "/auth/auth-user",
      providesTags: ["Auth"],
      query: () => "/auth/auth-user",
      providesTags: ["Auth"],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        url: "/auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
