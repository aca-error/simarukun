import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
interface LogContext {
    userId?: string;
    requestId?: string;
    ip?: string;
    userAgent?: string;
    method?: string;
    path?: string;
    statusCode?: number;
    [key: string]: any;
}
export declare class LoggerService extends ConsoleLogger {
    private readonly configService;
    private readonly winstonLogger;
    private readonly loggerContext;
    constructor(context: string, configService: ConfigService);
    log(message: string, context?: string, meta?: LogContext): void;
    error(message: string, trace?: string, context?: string, meta?: LogContext): void;
    warn(message: string, context?: string, meta?: LogContext): void;
    debug(message: string, context?: string, meta?: LogContext): void;
    verbose(message: string, context?: string, meta?: LogContext): void;
    custom(level: string, message: string, context?: string, meta?: LogContext): void;
    logRequest(method: string, path: string, statusCode: number, duration: number, userId?: string, ip?: string, userAgent?: string): void;
    logError(method: string, path: string, statusCode: number, error: Error, userId?: string, ip?: string, userAgent?: string): void;
    logQuery(query: string, params?: any[], duration?: number, error?: Error): void;
    logAuth(action: 'login' | 'logout' | 'register' | 'refresh', userId: string, email: string, success: boolean, ip?: string, userAgent?: string, error?: string): void;
    logAudit(action: string, userId: string, entity: string, entityId: string, metadata?: any, ip?: string, userAgent?: string): void;
}
export {};
