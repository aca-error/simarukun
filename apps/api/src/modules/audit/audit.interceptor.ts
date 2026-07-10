import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { User } from '../users/entities/user.entity';

const SENSITIVE_FIELDS = ['password', 'refreshToken', 'accessToken', 'token'];

function redactSensitive(data: any): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redactSensitive);

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_FIELDS.includes(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = redactSensitive(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | null;
    const method = request.method;
    const path = request.path;
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const ipAddress = request.ip || request.headers['x-forwarded-for'] || null;
    const userAgent = request.headers['user-agent'] || null;

    // Map HTTP method to audit action
    const actionMap: Record<string, string> = {
      POST: 'CREATE',
      GET: 'READ',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };

    const action = actionMap[method] || method;

    // Skip audit logging for health checks and static files
    if (path.includes('/health') || path.includes('/_next') || path.includes('/favicon') || path.includes('/metrics')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        const metadata = {
          action,
          path,
          method,
          statusCode,
          resourceId: data?.id || null,
        };

        // Only log if user is authenticated
        if (user) {
          this.auditService
            .logAction(action, user, metadata, ipAddress, userAgent)
            .catch((error) => {
              console.error('Failed to log audit action:', error);
            });
        } else if (path === '/auth/login' || path === '/auth/register') {
          // Log authentication attempts even without user (redact sensitive input)
          const sanitizedBody = redactSensitive(request.body || {});
          this.auditService
            .logAction(
              action,
              null,
              { ...metadata, email: request.body?.email },
              ipAddress,
              userAgent,
            )
            .catch((error) => {
              console.error('Failed to log audit action:', error);
            });
        }
      }),
    );
  }
}
