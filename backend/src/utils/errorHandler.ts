import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './AppError';
import { errorResponse } from './response';

export function errorHandler(error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  
  if (error instanceof ZodError || error.code === 'FST_ERR_VALIDATION') {
    let message = error.message;

    if (error instanceof ZodError) {
      message = error.issues.map((e) => e.message).join(', ');
    } else if ((error as FastifyError).validation) {
      message = ((error as FastifyError).validation as any[]).map((e) => e.message || e.keyword).join(', ');
    }

    return reply.status(400).send(errorResponse(message, 'Bad Request', 400));
  }

  
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send(
      errorResponse(error.message, error.code, error.statusCode)
    );
  }

  
  const statusCode = error.statusCode || 500;
  const title =
    statusCode === 401 ? 'Unauthorized'
    : statusCode === 403 ? 'Forbidden'
    : statusCode === 404 ? 'Not Found'
    : statusCode === 400 ? 'Bad Request'
    : 'Internal Server Error';

  return reply.status(statusCode).send(
    errorResponse(error.message || 'An unexpected error occurred', title, statusCode)
  );
}
