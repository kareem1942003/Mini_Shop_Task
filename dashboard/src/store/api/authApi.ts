import { baseApi } from './baseApi';
import type { User } from '../slices/authSlice';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
