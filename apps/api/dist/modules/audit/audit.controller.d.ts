import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditLogs(req: any, page?: number, limit?: number): Promise<{
        data: import("./audit.entity").AuditLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRecentAuditLogs(count?: number): Promise<import("./audit.entity").AuditLog[]>;
    getAuditLogsByAction(action: string): Promise<import("./audit.entity").AuditLog[]>;
}
