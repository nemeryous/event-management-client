import { rootApi } from './rootApi';

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ name, email, password, confirm_password, phone_number }) => ({
        url: '/auth/register',
        body: { name, email, password, confirm_password, phone_number },
        method: 'POST',
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        body: { email, password },
        method: 'POST',
      }),
    }),
    enableUser: builder.mutation({
      query: (id) => ({
        url: `/users/enable-user/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['UserList'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserList'],
    }),
    getAuthUser: builder.query({
      query: () => '/auth/auth-user',
      providesTags: ['Auth'],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getUserName: builder.query({
      query: (userId) => {
        console.log('getUserName API call - userId:', userId);
        return {
          url: `/users/${userId}/name`,
          responseHandler: (response) => response.text(), // nhận kiểu text
        };
      },
      providesTags: (result, error, userId) => [{ type: 'UserName', id: userId }],
      transformResponse: (response) => {
        console.log('getUserName API response:', response);
        // Nếu backend trả về chuỗi tên, trả về luôn
        if (typeof response === 'string') return response;
        // Nếu backend trả về object JSON
        if (response && typeof response === 'object') {
          return response.name || response.userName || response.displayName || JSON.stringify(response);
        }
        return response;
      },
      transformErrorResponse: (error) => {
        console.log('getUserName API error:', error);
        return error;
      },
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['UserList'],
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
  useGetUserNameQuery,
  useGetAllUsersQuery,
  useEnableUserMutation,
  useDeleteUserMutation,
} = authApi; 