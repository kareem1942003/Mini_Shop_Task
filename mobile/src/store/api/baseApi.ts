import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: API_URL,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    });

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
    }

    return result;
  },
  tagTypes: ['Products', 'Orders', 'Categories', 'User'],
  endpoints: () => ({}),
});
