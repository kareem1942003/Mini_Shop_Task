import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { errorResponse } from './response';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  // Handle Zod Validation Errors
  if (error instanceof ZodError || error.code === 'FST_ERR_VALIDATION') {
    return reply.status(400).send(
      errorResponse('Validation failed', 'VALIDATION_ERROR', error.validation || error)
    );
  }

  // Handle Custom App Errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send(
      errorResponse(error.message, error.name || 'HTTP_ERROR')
    );
  }

  // Handle Generic Internal Errors
  return reply.status(500).send(
    errorResponse('An unexpected error occurred', 'INTERNAL_SERVER_ERROR')
  );
}
