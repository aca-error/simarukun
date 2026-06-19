import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | null;
    const method = request.method;
    const path = request.path;
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
    if (path.includes('/health') || path.includes('/_next') || path.includes('/favicon')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        // Only log if user is authenticated
        if (user) {
          this.auditService
            .logAction(action, user, { path, data }, ipAddress, userAgent)
            .catch((error) => {
              console.error('Failed to log audit action:', error);
            });
        } else if (path === '/auth/login' || path === '/auth/register') {
          // Log authentication attempts even without user
          this.auditService
            .logAction(
              action,
              null,
              { path, data: { email: request.body?.email } },
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
