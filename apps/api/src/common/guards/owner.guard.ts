import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';

/**
 * Metadata key for owner check
 */
export const OWNER_CHECK_KEY = 'owner_check';

/**
 * Decorator to enable owner-based authorization
 * Only the owner of a resource can access it
 */
export const CheckOwner = () => {
  return (target: any, propertyKey: string) => {
    Reflect.setMetadata(OWNER_CHECK_KEY, true, target, propertyKey);
  };
};

/**
 * Guard that checks if the user is the owner of the resource
 * Works in combination with entity retrieval
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const checkOwner = this.reflector.get<boolean>(
      OWNER_CHECK_KEY,
      context.getHandler(),
    );

    if (!checkOwner) {
      return true; // Skip if owner check is not enabled
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    // If no user, deny access
    if (!user || !user.id) {
      throw new ForbiddenException('Unauthorized');
    }

    // Check if userId param matches user id
    const userIdParam = params.userId || params.id;
    
    if (userIdParam && userIdParam !== user.id) {
      // Additional check: if user has admin role, allow
      const allowedRoles = [UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN];
      if (allowedRoles.includes(user.role as UserRole)) {
        return true;
      }
      
      throw new ForbiddenException('You can only access your own resources');
    }

    return true;
  }
}
