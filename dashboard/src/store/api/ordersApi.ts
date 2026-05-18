import { baseApi } from './baseApi';
import type { Product } from './productsApi';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  profiles: {
    id: string;
    name: string;
  };
  order_items: OrderItem[];
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<any, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
