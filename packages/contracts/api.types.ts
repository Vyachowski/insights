/** JSON envelope for successful HTTP responses (see backend ResponseInterceptor). */
export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/** Error payload inside {@link ApiErrorResponse}. */
export interface ApiErrorPayload {
  code: number;
  message: string;
}

/** JSON envelope for error responses (see backend AllExceptionsFilter). */
export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  timestamp: string;
}
