import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<any, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
