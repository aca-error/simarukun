import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Decorator for standard CRUD endpoints with authentication and role-based access
 */
export function CrudEndpoints(options: {
  name: string;
  path?: string;
  createDto?: any;
  updateDto?: any;
  roles?: {
    findAll?: UserRole[];
    findOne?: UserRole[];
    create?: UserRole[];
    update?: UserRole[];
    delete?: UserRole[];
  };
  throttleLimit?: number;
  throttleTTL?: number;
}) {
  const {
    name,
    path = '',
    roles = {
      findAll: [UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN],
      findOne: [UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA],
      create: [UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA],
      update: [UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN],
      delete: [UserRole.SUPERADMIN, UserRole.SUPERVISOR],
    },
    throttleLimit = 100,
    throttleTTL = 60000,
  } = options;

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Apply common decorators
    UseGuards(JwtAuthGuard, RolesGuard)(target, propertyKey, descriptor);
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiTags(name)(target.constructor, undefined, descriptor);
  };
}

/**
 * Standard pagination query DTO
 */
export class PaginationDto {
  @ApiQuery({ name: 'page', required: false, type: Number })
  page?: number = 1;

  @ApiQuery({ name: 'limit', required: false, type: Number })
  limit?: number = 10;

  @ApiQuery({ name: 'sortBy', required: false, type: String })
  sortBy?: string;

  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: 'ASC' | 'DESC';
}
