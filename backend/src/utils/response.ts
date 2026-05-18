export function successResponse<T>(data: T, message: string = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, errorTitle: string = 'Bad Request', statusCode: number = 400) {
  return {
    statusCode,
    error: errorTitle,
    message,
  };
}
