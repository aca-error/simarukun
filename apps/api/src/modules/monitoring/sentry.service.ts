import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SentryService implements OnModuleInit {
  private readonly logger = new Logger(SentryService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeSentry();
  }

  private initializeSentry() {
    const dsn = this.configService.get<string>('SENTRY_DSN');
    const environment = this.configService.get<string>('NODE_ENV') || 'development';
    const release = this.configService.get<string>('RELEASE_VERSION') || '1.0.0';

    if (!dsn) {
      this.logger.warn('SENTRY_DSN is not configured. Sentry will not be initialized.');
      return;
    }

    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      environment,
      release,
      integrations: [
        new Integrations.Http({ tracing: true }),
        new Integrations.Express(),
      ],
      beforeSend(event) {
        // Add custom data to all events
        event.tags = {
          ...event.tags,
          app: 'simarukun-api',
          environment,
          release,
        };
        return event;
      },
    });

    this.logger.log('Sentry initialized successfully');
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, context);
  }

  /**
   * Capture a message
   */
  captureMessage(
    message: string,
    level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'error',
    context?: Record<string, any>,
  ) {
    Sentry.captureMessage(message, this.mapSeverity(level), context);
  }

  /**
   * Start a transaction
   */
  startTransaction(name: string, options?: Sentry.TransactionOptions) {
    return Sentry.startTransaction(name, options);
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; role?: string }) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.email,
      role: user.role,
    });
  }

  /**
   * Set extra context
   */
  setContext(key: string, value: any) {
    Sentry.setContext(key, value);
  }

  /**
   * Set tags
   */
  setTags(tags: Record<string, string>) {
    Sentry.setTags(tags);
  }

  /**
   * Clear context
   */
  clearContext() {
    Sentry.getCurrentHub().getScope()?.clear();
  }

  /**
   * Flush events
   */
  async flush(timeout?: number) {
    return Sentry.flush(timeout);
  }

  /**
   * Close Sentry
   */
  async close(timeout?: number) {
    return Sentry.close(timeout);
  }

  /**
   * Map severity level
   */
  private mapSeverity(
    level: 'debug' | 'info' | 'warning' | 'error' | 'fatal',
  ): Sentry.SeverityLevel {
    const severityMap: Record<string, Sentry.SeverityLevel> = {
      debug: 'debug',
      info: 'info',
      warning: 'warning',
      error: 'error',
      fatal: 'fatal',
    };
    return severityMap[level] || 'error';
  }
}
