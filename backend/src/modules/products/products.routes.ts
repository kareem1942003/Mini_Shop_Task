import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requireAdmin } from '../../middleware/admin';
import {
  productQuerySchema,
  productParamsSchema,
  createProductSchema,
  updateProductSchema,
} from './products.schemas';
import {
  listProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  uploadImageHandler,
} from './products.controllers';

export default async function productRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // ── Public ─────────────────────────────────────────────
  typedApp.get('/', {
    schema: {
      querystring: productQuerySchema,
      description: 'List products with search, filter, pagination',
      tags: ['Products'],
    },
  }, listProductsHandler);

  typedApp.get('/:id', {
    schema: {
      params: productParamsSchema,
      description: 'Get product by ID',
      tags: ['Products'],
    },
  }, getProductHandler);

  // ── Admin Only ─────────────────────────────────────────
  typedApp.post('/', {
    preHandler: [requireAdmin],
    schema: {
      body: createProductSchema,
      description: 'Create a product',
      tags: ['Products'],
    },
  }, createProductHandler);

  typedApp.patch('/:id', {
    preHandler: [requireAdmin],
    schema: {
      params: productParamsSchema,
      body: updateProductSchema,
      description: 'Update a product',
      tags: ['Products'],
    },
  }, updateProductHandler);

  typedApp.delete('/:id', {
    preHandler: [requireAdmin],
    schema: {
      params: productParamsSchema,
      description: 'Soft-delete a product',
      tags: ['Products'],
    },
  }, deleteProductHandler);

  // ── Image Upload (Admin Only) ─────────────────────────
  typedApp.post('/upload', {
    preHandler: [requireAdmin],
    schema: {
      description: 'Upload a product image to Supabase Storage',
      tags: ['Products'],
    },
  }, uploadImageHandler);
}
