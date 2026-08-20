import { User } from '../users/entities/user.entity';
export declare class AuditLog {
    id: string;
    action: string;
    metadata: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    user: User | null;
    createdAt: Date;
}
