/**
 * Custom application error class that works properly with Fastify's error handler.
 * Always throw AppError instead of plain objects to ensure consistent error handling.
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 400, code?: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code || this.deriveCode(statusCode);
    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  private deriveCode(statusCode: number): string {
    switch (statusCode) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 409: return 'CONFLICT';
      case 429: return 'TOO_MANY_REQUESTS';
      default:  return 'INTERNAL_SERVER_ERROR';
    }
  }
}
