import { clearToken, setToken, setUser } from "@store/slices/authSlice";
import { rootApi } from "./rootApi";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number }) => ({
        url: "/auth/register",

        body: { name, email, password, confirm_password, phone_number },
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        body: { email, password },
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data));
          dispatch(
            authApi.util.getAuthUser.initiate(undefined, {
              forceRefetch: true,
            }),
          );
        } catch {
          //
        }
      },
      invalidatesTags: ["Auth"],
    }),
    getAuthUser: builder.query({
      query: () => "/auth/auth-user",
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          //
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearToken());
          dispatch(rootApi.util.resetApiState());
        }
      },
      invalidatesTags: ["Auth"],
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
