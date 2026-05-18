import fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { errorHandler } from './utils/errorHandler';

// Helper for generating the Fastify app instance
export function buildApp() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  // Add Type Provider Compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Error Handler
  app.setErrorHandler(errorHandler);

  // Plugins
  app.register(cors, {
    origin: '*', // Customize based on environment if needed
  });

  // Example Health Check
  app.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Route Registration placeholder
  // app.register(authRoutes, { prefix: '/api/v1/auth' });
  // app.register(productRoutes, { prefix: '/api/v1/products' });
  // app.register(categoryRoutes, { prefix: '/api/v1/categories' });
  // app.register(orderRoutes, { prefix: '/api/v1/orders' });

  return app;
}
