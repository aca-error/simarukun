import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Generate request ID
    const requestId = request.headers['x-request-id'] || uuidv4();
    request.requestId = requestId;

    // Get user info from request
    const user = request.user || {};
    const userId = user?.sub || user?.id || 'anonymous';
    const ip = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Log successful request
        this.logger.logRequest(
          request.method,
          request.url,
          statusCode,
          duration,
          userId,
          ip,
          userAgent,
        );
      }),
      catchError((err) => {
        const duration = Date.now() - startTime;
        const statusCode = err instanceof HttpException 
          ? err.getStatus() 
          : 500;

        // Log error
        if (err instanceof Error) {
          this.logger.logError(
            request.method,
            request.url,
            statusCode,
            err,
            userId,
            ip,
            userAgent,
          );
        } else {
          this.logger.error(
            'Unknown error',
            undefined,
            'LoggerInterceptor',
            {
              method: request.method,
              url: request.url,
              statusCode,
              error: String(err),
              userId,
              ip,
              userAgent,
              requestId,
            },
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
