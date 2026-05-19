import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';
import {
  createOrderSchema,
  orderQuerySchema,
  orderParamsSchema,
  updateOrderStatusSchema,
} from './orders.schemas';
import {
  createOrderHandler,
  myOrdersHandler,
  allOrdersHandler,
  updateOrderStatusHandler,
} from './orders.controllers';

export default async function orderRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  
  typedApp.post('/', {
    preHandler: [requireAuth],
    schema: {
      body: createOrderSchema,
      description: 'Place a new order',
      tags: ['Orders'],
    },
  }, createOrderHandler);

  typedApp.get('/my', {
    preHandler: [requireAuth],
    schema: {
      querystring: orderQuerySchema,
      description: 'Get my orders',
      tags: ['Orders'],
    },
  }, myOrdersHandler);

  
  typedApp.get('/', {
    preHandler: [requireAdmin],
    schema: {
      querystring: orderQuerySchema,
      description: 'List all orders (admin)',
      tags: ['Orders'],
    },
  }, allOrdersHandler);

  typedApp.patch('/:id/status', {
    preHandler: [requireAdmin],
    schema: {
      params: orderParamsSchema,
      body: updateOrderStatusSchema,
      description: 'Update order status (admin)',
      tags: ['Orders'],
    },
  }, updateOrderStatusHandler);
}
