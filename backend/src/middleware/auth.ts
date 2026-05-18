import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send(errorResponse('Missing or invalid token', 'Unauthorized', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Attach user to request
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send(errorResponse('Invalid or expired token', 'Unauthorized', 401));
  }
}
