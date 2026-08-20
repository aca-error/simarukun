/**
 * Shared API types for frontend-backend consistency
 * These types match the backend API response format
 */

/**
 * Standardized pagination interface (matches backend)
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/**
 * Standard API response wrapper (matches backend)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Standard error response (matches backend)
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

/**
 * Common pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
