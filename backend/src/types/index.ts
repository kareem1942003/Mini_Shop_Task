import 'fastify';

export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}

declare module 'fastify' {
  export interface FastifyRequest {
    /** Populated by requireAuth middleware. Only available on protected routes. */
    user: UserPayload;
  }
}
