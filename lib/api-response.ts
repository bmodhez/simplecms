export function apiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  statusCode: number = 200
) {
  return Response.json({ success, message, data }, { status: statusCode });
}

export function successResponse<T>(message: string, data?: T) {
  return apiResponse(true, message, data, 200);
}

export function errorResponse(message: string, statusCode: number = 400) {
  return apiResponse(false, message, undefined, statusCode);
}

export function notFoundResponse(message: string = "Not found") {
  return apiResponse(false, message, undefined, 404);
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return apiResponse(false, message, undefined, 401);
}
