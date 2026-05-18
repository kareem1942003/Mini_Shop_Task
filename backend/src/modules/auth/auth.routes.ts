import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerHandler, loginHandler, forgotPasswordHandler, meHandler } from './auth.controllers';
import { registerSchema, loginSchema, forgotPasswordSchema } from './auth.schemas';
import { requireAuth } from '../../middleware/auth';

export default async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post('/register', {
    schema: {
      body: registerSchema,
      description: 'Register a new user',
      tags: ['Auth']
    }
  }, registerHandler);

  typedApp.post('/login', {
    schema: {
      body: loginSchema,
      description: 'Login utilizing email and password',
      tags: ['Auth']
    }
  }, loginHandler);

  typedApp.post('/forgot-password', {
    schema: {
      body: forgotPasswordSchema,
      description: 'Send a password reset email',
      tags: ['Auth']
    }
  }, forgotPasswordHandler);

  typedApp.get('/me', {
    preHandler: [requireAuth],
    schema: {
      description: 'Get the logged-in user profile',
      tags: ['Auth']
    }
  }, meHandler);
}
