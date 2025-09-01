import { rootApi } from "./rootApi";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number }) => ({
        url: "/auth/register",

        body: { name, email, password, confirm_password, phone_number },
        method: "POST",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        body: { email, password },
        method: "POST",
      }),
    }),
    getAuthUser: builder.query({
      query: () => "/auth/auth-user",
      providesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    enableUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/enable`,
        method: "POST",
      }),
      invalidatesTags: ["UserList"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserList"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["UserList"],
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword, confirmPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmPassword,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAuthUserQuery,
  useLogoutMutation,
  useGetAllUsersQuery,
  useEnableUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
} = authApi;
