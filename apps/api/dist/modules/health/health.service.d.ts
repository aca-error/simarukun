import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export interface HealthCheckResult {
    status: 'ok' | 'error' | 'degraded';
    timestamp: string;
    uptime: number;
    service: string;
    version?: string;
    checks?: Record<string, HealthCheckStatus>;
}
export interface HealthCheckStatus {
    status: 'ok' | 'error' | 'degraded';
    message?: string;
    latency?: number;
    details?: any;
}
export declare class HealthService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    check(): Promise<HealthCheckResult>;
    checkDetailed(): Promise<HealthCheckResult>;
    checkDb(): Promise<HealthCheckResult>;
    checkRedis(): Promise<HealthCheckResult>;
}
