import { rootApi } from "./rootApi";

const donViTags = [
  "DonVis",
];

export const donViApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // DonVi CRUD
    getAllDonVi: builder.query({
      query: () => "/donvi",
      providesTags: ["DonVis"],
    }),
    getDonViById: builder.query({
      query: (id) => `/donvi/${id}`,
      providesTags: (result, error, id) => [
        { type: "DonVis", id },
      ],
    }),
    createDonVi: builder.mutation({
      query: (data) => ({
        url: "/donvi",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [...donViTags],
    }),
    updateDonVi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/donvi/${id}`,
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DonVis", id },
        ...donViTags,
      ],
    }),
    deleteDonVi: builder.mutation({
      query: (id) => ({
        url: `/donvi/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [...donViTags],
    }),

    // Extra endpoints
    getTenDonViByDonVi: builder.query({
      query: (donVi) => `/donvi/ten-don-vi/${encodeURIComponent(donVi)}`,
    }),
    getUsersByDonVi: builder.query({
      query: (donVi) => `/users/by-don-vi/${encodeURIComponent(donVi)}`,
    }),
    getUsersByTenDonVi: builder.query({
      query: (tenDonVi) => `/users/by-ten-don-vi/${encodeURIComponent(tenDonVi)}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllDonViQuery,
  useGetDonViByIdQuery,
  useCreateDonViMutation,
  useUpdateDonViMutation,
  useDeleteDonViMutation,
  useGetTenDonViByDonViQuery,
  useGetUsersByDonViQuery,
  useGetUsersByTenDonViQuery,
} = donViApi;


