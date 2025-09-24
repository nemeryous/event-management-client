import { rootApi } from "./rootApi";

export const unitApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    listUnits: builder.query({
      query: ({ q, page = 0, size = 10, sort } = {}) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (page !== undefined) params.set("page", page);
        if (size !== undefined) params.set("size", size);
        if (sort) params.set("sort", sort);
        const qs = params.toString();
        return { url: `/units${qs ? `?${qs}` : ""}`, method: "GET" };
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map((u) => ({ type: "Units", id: u.id })),
              { type: "Units", id: "LIST" },
            ]
          : [{ type: "Units", id: "LIST" }],
    }),
    getUnitById: builder.query({
      query: (id) => ({ url: `/units/${id}`, method: "GET" }),
      providesTags: (result, _err, id) => [{ type: "Units", id }],
    }),
    createUnit: builder.mutation({
      query: (payload) => ({
        url: "/units",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Units", id: "LIST" }],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/units/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Units", id },
        { type: "Units", id: "LIST" },
      ],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({ url: `/units/${id}`, method: "DELETE" }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Units", id },
        { type: "Units", id: "LIST" },
      ],
    }),
    getAllUnits: builder.query({
      query: () => "/units/all",
      providesTags: ["Units"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useGetAllUnitsQuery,
} = unitApi;
