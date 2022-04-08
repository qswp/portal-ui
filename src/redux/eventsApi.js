import { portalApi } from './portalApi'

const eventsApi = portalApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query({
      query: (allResults) => allResults ? 'events?all=true' : 'events',
      providesTags: ['EVENTS'],
    }),
    getEvent: builder.query({
      query: ({eventSeriesId, eventId}) => `events/${eventSeriesId}/${eventId}`,
      providesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}],
    }),
    createEvent: builder.mutation({
      query: ( { eventSeriesId, eventId, body }) => ({
        url: `events/${eventSeriesId}/${eventId}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['EVENTS'],
    }),
    editEvent: builder.mutation({
      query: ( { eventSeriesId, eventId, body }) => ({
        url: `events/${eventSeriesId}/${eventId}`,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS'],
    }),
    deleteEvent: builder.mutation({
      query: ( { eventSeriesId, eventId }) => ({
        url: `events/${eventSeriesId}/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS'],
    }),
    registerForEvent: builder.mutation({
      query: ({ eventSeriesId, eventId, membershipNumber }) => ({
        url: `events/${eventSeriesId}/${eventId}/register/${membershipNumber}`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS'],
    }),
    allocateToEvent: builder.mutation({
      query: ({ eventSeriesId, eventId, allocations }) => ({
        url: `events/${eventSeriesId}/${eventId}/allocate`,
        method: 'PUT',
        body: {
          "allocations": allocations
        }
      }),
      invalidatesTags: (_result, _error, {eventSeriesId, eventId}) => [{type: 'EVENT', id: `${eventSeriesId}/${eventId}`}, 'EVENTS'],
    }),
    listEventSeries: builder.query({
      query: () => `events/_series`,
      providesTags: ['ALL_EVENT_SERIES'],
    }),
    getEventSeries: builder.query({
      query: (eventSeriesId) => `events/${eventSeriesId}`,
      providesTags: (_result, _error, eventSeriesId) => [{type: 'EVENT_SERIES', id: eventSeriesId}],
    }),
    createEventSeries: builder.mutation({
      query: ( { eventSeriesId, body }) => ({
        url: `events/${eventSeriesId}`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['ALL_EVENT_SERIES'],
    })
  }),
  overrideExisting: false,
})

export const { useListEventsQuery, useGetEventQuery, useCreateEventMutation, useEditEventMutation, useDeleteEventMutation, useRegisterForEventMutation, useAllocateToEventMutation, useListEventSeriesQuery, useGetEventSeriesQuery, useCreateEventSeriesMutation } = eventsApi
