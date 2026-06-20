import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    // Skip CSRF check for health check and static files
    if (
      request.path.includes('/health') ||
      request.path.includes('/_next') ||
      request.path.includes('/favicon')
    ) {
      return true;
    }

    // Check if X-XSRF-TOKEN header exists and matches the cookie
    const csrfToken = request.headers['x-xsrf-token'] || request.headers['X-XSRF-TOKEN'];
    const cookieToken = request.cookies?.['XSRF-TOKEN'];

    if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
      return false;
    }

    return true;
  }
}
