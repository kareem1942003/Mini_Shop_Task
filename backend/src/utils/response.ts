export function successResponse<T>(data: T, message: string = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, code: string = 'INTERNAL_SERVER_ERROR', details?: any) {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}
