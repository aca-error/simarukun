/**
 * Shared types and interfaces for the entire application
 */

/**
 * Standardized pagination interface
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Standard error response
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

/**
 * Base entity properties (for all entities)
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * User-related types
 */
export type UserRoleType = 'SUPERADMIN' | 'SUPERVISOR' | 'ADMIN' | 'WARGA';

/**
 * Audit log interface
 */
export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

/**
 * Statistics base interface (can be extended by specific stats)
 */
export interface BaseStats {
  total: number;
  [key: string]: number | Record<string, number>;
}
