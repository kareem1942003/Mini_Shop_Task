import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/categories.routes';
import productRoutes from './modules/products/products.routes';
import orderRoutes from './modules/orders/orders.routes';

export function buildApp() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  // Type Provider Compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Plugins
  app.register(cors, { 
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  });
  app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

  // Health Check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Route Registration
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(categoryRoutes, { prefix: '/api/v1/categories' });
  app.register(productRoutes, { prefix: '/api/v1/products' });
  app.register(orderRoutes, { prefix: '/api/v1/orders' });

  return app;
}
