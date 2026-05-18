import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send(errorResponse('Unauthorized: Missing or invalid token', 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Attach user to request
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send(errorResponse('Unauthorized: Invalid or expired token', 'UNAUTHORIZED'));
  }
}
