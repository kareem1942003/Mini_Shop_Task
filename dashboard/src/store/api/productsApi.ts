import { baseApi } from './baseApi';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string;
  is_active: boolean;
  created_at: string;
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    products?: T[];
    orders?: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, { page?: number; limit?: number; search?: string; show_all?: boolean }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<{ success: boolean; data: Product }, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<{ success: boolean; data: Product }, { id: string; body: Partial<Product> }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    uploadImage: builder.mutation<{ success: boolean; data: { url: string } }, FormData>({
      query: (body) => ({
        url: '/products/upload',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
} = productsApi;
