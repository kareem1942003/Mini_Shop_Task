import { baseApi } from './baseApi';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCategoriesQuery } = categoriesApi;
