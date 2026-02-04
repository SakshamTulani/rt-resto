/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: never;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
  data?: never;
}

/**
 * Combined API result type
 */
export type ApiResult<T> = ApiResponse<T> | ApiError;

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
