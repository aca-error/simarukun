import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { LaporanService } from './laporan.service';

@ApiTags('Laporan')
@Controller('laporan')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Laporan module status (skeleton)' })
  getStatus() {
    return this.laporanService.getStatus();
  }
}
