import { Request } from 'express';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../../modules/users/entities/user.entity';
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    timestamp?: string;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
    statusCode: number;
    timestamp?: string;
    path?: string;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
export type UserRoleType = 'SUPERADMIN' | 'SUPERVISOR' | 'ADMIN' | 'WARGA';
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
export interface FileUploadResult {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    path: string;
}
export interface BaseStats {
    total: number;
    [key: string]: number | Record<string, number>;
}
export interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
        role: UserRole;
        nama: string;
    } & Partial<User>;
}
export interface UserContext {
    id: string;
    email: string;
    role: UserRole;
    nama: string;
}
