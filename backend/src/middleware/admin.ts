import { FastifyReply, FastifyRequest } from 'fastify';
import { errorResponse } from '../utils/response';
import { requireAuth } from './auth';

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  
  await requireAuth(request, reply);
  
  
  if (reply.sent) return;

  if (request.user.role !== 'admin') {
    return reply.status(403).send(errorResponse('Admin access required', 'Forbidden', 403));
  }
}
