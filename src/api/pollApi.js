import { rootApi } from "./rootApi";

export const pollApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPollsByEvent: builder.query({
      query: (eventId) => `/polls/events/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: "Polls", id: eventId },
      ],
    }),
    getPoll: builder.query({
      query: (pollId) => `/polls/${pollId}`,
      providesTags: (result, error, pollId) => [{ type: "Poll", id: pollId }],
    }),
    getMyVotedOptions: builder.query({
      query: (pollId) => `/polls/${pollId}/my-options`,
      providesTags: (result, error, pollId) => [
        { type: "MyVotedOptions", id: pollId },
      ],
    }),
    votePoll: builder.mutation({
      query: ({ pollId, optionIds }) => ({
        url: `/polls/${pollId}/vote`,
        method: "POST",
        body: { optionIds },
      }),
      invalidatesTags: (result, error, { pollId }) => [
        { type: "Poll", id: pollId },
        { type: "Polls" },
      ],
    }),
    createPoll: builder.mutation({
      query: (newPoll) => ({
        url: `/polls`,
        method: "POST",
        body: newPoll,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPollsByEventQuery,
  useGetPollQuery,
  useVotePollMutation,
  useGetMyVotedOptionsQuery,
  useCreatePollMutation
} = pollApi;
