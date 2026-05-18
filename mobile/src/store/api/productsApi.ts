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

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any, { page?: number; limit?: number; search?: string; category_id?: string }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Products'],
    }),
    getCategories: builder.query<any, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetCategoriesQuery } = productsApi;
