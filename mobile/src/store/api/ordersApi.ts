import { baseApi } from './baseApi';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, { items: { product_id: string; quantity: number }[] }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    getMyOrders: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/orders/my',
        params,
      }),
      providesTags: ['Orders'],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useGetMyOrdersQuery } = ordersApi;
