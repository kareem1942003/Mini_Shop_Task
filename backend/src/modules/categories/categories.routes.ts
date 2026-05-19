import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { requireAdmin } from '../../middleware/admin';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from './categories.schemas';
import {
  listCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from './categories.controllers';

export default async function categoryRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  
  typedApp.get('/', {
    schema: { description: 'List all categories', tags: ['Categories'] },
  }, listCategoriesHandler);

  typedApp.get('/:id', {
    schema: { params: categoryParamsSchema, description: 'Get category by ID', tags: ['Categories'] },
  }, getCategoryHandler);

  
  typedApp.post('/', {
    preHandler: [requireAdmin],
    schema: { body: createCategorySchema, description: 'Create a category', tags: ['Categories'] },
  }, createCategoryHandler);

  typedApp.patch('/:id', {
    preHandler: [requireAdmin],
    schema: {
      params: categoryParamsSchema,
      body: updateCategorySchema,
      description: 'Update a category',
      tags: ['Categories'],
    },
  }, updateCategoryHandler);

  typedApp.delete('/:id', {
    preHandler: [requireAdmin],
    schema: { params: categoryParamsSchema, description: 'Delete a category', tags: ['Categories'] },
  }, deleteCategoryHandler);
}
