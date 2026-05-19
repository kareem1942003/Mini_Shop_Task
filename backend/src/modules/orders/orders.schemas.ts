import { z } from 'zod';


const orderItemSchema = z.object({
  product_id: z.string().uuid({ message: 'Invalid product ID' }),
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
});


export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, { message: 'Order must contain at least one item' }),
});


export const orderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
});


export const orderParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid order ID' }),
});


export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    message: 'Status must be one of: pending, processing, shipped, delivered, cancelled',
  }),
});


export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
export type OrderParams = z.infer<typeof orderParamsSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
