import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Get all audit logs (Super Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAuditLogs(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.auditService.getAuditLogs(req.user?.id, page, limit);
  }

  @Get('recent')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Get recent audit logs (Super Admin & Supervisor)' })
  @ApiQuery({ name: 'count', required: false, type: Number })
  async getRecentAuditLogs(@Query('count') count: number = 10) {
    return this.auditService.getRecentAuditLogs(count);
  }

  @Get('by-action')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Get audit logs by action type (Super Admin only)' })
  @ApiQuery({ name: 'action', required: true, type: String })
  async getAuditLogsByAction(@Query('action') action: string) {
    return this.auditService.getAuditLogsByAction(action);
  }
}
