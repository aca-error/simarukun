import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';
import { User } from '../users/entities/user.entity';
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    logAction(action: string, user: User | null, metadata?: Record<string, any>, ipAddress?: string | null, userAgent?: string | null): Promise<AuditLog>;
    getAuditLogs(userId?: string, page?: number, limit?: number): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAuditLogsByAction(action: string): Promise<AuditLog[]>;
    getRecentAuditLogs(count?: number): Promise<AuditLog[]>;
}
