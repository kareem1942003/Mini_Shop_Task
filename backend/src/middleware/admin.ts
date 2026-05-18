import { FastifyReply, FastifyRequest } from 'fastify';
import { errorResponse } from '../utils/response';
import { requireAuth } from './auth';

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  // First ensure the user is authenticated
  await requireAuth(request, reply);
  
  // Check if response was already sent by requireAuth (e.g. error)
  if (reply.sent) return;

  if (request.user.role !== 'admin') {
    return reply.status(403).send(errorResponse('Forbidden: Admin access required', 'FORBIDDEN'));
  }
}
