import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ServerService } from './server.service';

@ApiTags('Server')
@Controller('server')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Server module status (skeleton)' })
  getStatus() {
    return this.serverService.getStatus();
  }
}
