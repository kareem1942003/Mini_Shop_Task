import { z } from 'zod';


export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  show_all: z.coerce.boolean().optional().default(false),
});


export const productParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid product ID' }),
});


export const createProductSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters' }).trim(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }).trim(),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  category_id: z.string().uuid({ message: 'Invalid category ID' }),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();


export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
