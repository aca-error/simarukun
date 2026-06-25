import { Injectable, Logger, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

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

interface LogMessage {
  message: string;
  context?: string;
  level: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  meta?: LogContext;
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly winstonLogger: winston.Logger;
  private readonly loggerContext: string;

  constructor(
    context: string,
    private readonly configService: ConfigService,
  ) {
    super(context);
    this.loggerContext = context;

    this.winstonLogger = winston.createLogger({
      level: this.configService.get<string>('LOG_LEVEL') || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
              const contextStr = context ? `[${context}]` : '';
              const metaStr =
                Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}] ${contextStr} ${message}${metaStr}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
      exitOnError: false,
    });
  }

  /**
   * Log a message
   */
  log(message: string, context?: string, meta?: LogContext) {
    this.winstonLogger.info({
      message,
      context: context || this.loggerContext,
      ...meta,
    });
    super.log(message, context);
  }

  /**
   * Log an error
   */
  error(message: string, trace?: string, context?: string, meta?: LogContext) {
    this.winstonLogger.error({
      message,
      context: context || this.loggerContext,
      trace,
      ...meta,
    });
    super.error(message, trace, context);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: string, meta?: LogContext) {
    this.winstonLogger.warn({
      message,
      context: context || this.loggerContext,
      ...meta,
    });
    super.warn(message, context);
  }

  /**
   * Log debug information
   */
  debug(message: string, context?: string, meta?: LogContext) {
    this.winstonLogger.debug({
      message,
      context: context || this.loggerContext,
      ...meta,
    });
    super.debug(message, context);
  }

  /**
   * Log verbose information
   */
  verbose(message: string, context?: string, meta?: LogContext) {
    this.winstonLogger.verbose({
      message,
      context: context || this.loggerContext,
      ...meta,
    });
    super.verbose(message, context);
  }

  /**
   * Log with custom level
   */
  custom(level: string, message: string, context?: string, meta?: LogContext) {
    this.winstonLogger.log(level, message, {
      context: context || this.loggerContext,
      ...meta,
    });
  }

  /**
   * Log HTTP request
   */
  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string,
    ip?: string,
    userAgent?: string,
  ) {
    this.winstonLogger.info({
      message: 'HTTP Request',
      context: 'HTTP',
      method,
      path,
      statusCode,
      duration,
      userId,
      ip,
      userAgent,
    });
  }

  /**
   * Log HTTP error
   */
  logError(
    method: string,
    path: string,
    statusCode: number,
    error: Error,
    userId?: string,
    ip?: string,
    userAgent?: string,
  ) {
    this.winstonLogger.error({
      message: 'HTTP Error',
      context: 'HTTP',
      method,
      path,
      statusCode,
      error: error.message,
      stack: error.stack,
      userId,
      ip,
      userAgent,
    });
  }

  /**
   * Log database query
   */
  logQuery(query: string, params?: any[], duration?: number, error?: Error) {
    if (error) {
      this.winstonLogger.error({
        message: 'Database Query Error',
        context: 'Database',
        query,
        params,
        duration,
        error: error.message,
        stack: error.stack,
      });
    } else {
      this.winstonLogger.debug({
        message: 'Database Query',
        context: 'Database',
        query,
        params,
        duration,
      });
    }
  }

  /**
   * Log authentication event
   */
  logAuth(
    action: 'login' | 'logout' | 'register' | 'refresh',
    userId: string,
    email: string,
    success: boolean,
    ip?: string,
    userAgent?: string,
    error?: string,
  ) {
    const level = success ? 'info' : 'warn';
    this.winstonLogger.log(level, {
      message: `Authentication ${action}`,
      context: 'Auth',
      action,
      userId,
      email,
      success,
      ip,
      userAgent,
      error,
    });
  }

  /**
   * Log audit event
   */
  logAudit(
    action: string,
    userId: string,
    entity: string,
    entityId: string,
    metadata?: any,
    ip?: string,
    userAgent?: string,
  ) {
    this.winstonLogger.info({
      message: 'Audit Log',
      context: 'Audit',
      action,
      userId,
      entity,
      entityId,
      metadata,
      ip,
      userAgent,
    });
  }
}
