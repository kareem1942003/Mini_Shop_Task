import 'fastify';

export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}

declare module 'fastify' {
  export interface FastifyRequest {
    user: UserPayload;
  }
}
