import { OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';
export declare class SentryService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initializeSentry;
    captureException(error: Error, context?: Record<string, any>): void;
    captureMessage(message: string, level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal', context?: Record<string, any>): void;
    startTransaction(name: string, options?: Record<string, unknown>): Sentry.Span;
    setUser(user: {
        id: string;
        email?: string;
        role?: string;
    }): void;
    setContext(key: string, value: any): void;
    setTags(tags: Record<string, string>): void;
    clearContext(): void;
    flush(timeout?: number): Promise<boolean>;
    close(timeout?: number): Promise<boolean>;
    private mapSeverity;
}
