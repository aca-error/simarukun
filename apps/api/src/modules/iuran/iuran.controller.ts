import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IuranService } from './iuran.service';
import { CreateIuranDto } from './dto/create-iuran.dto';
import { UpdateIuranDto } from './dto/update-iuran.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Iuran')
@Controller('iuran')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IuranController {
  constructor(private readonly iuranService: IuranService) {}

  /**
   * Get all iuran records (with pagination)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param status - Filter by status (optional)
   * @param tahun - Filter by year (optional)
   * @param bulan - Filter by month (optional)
   */
  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle('medium') // Rate limiting: 100 requests per minute
  @ApiOperation({ summary: 'Get all iuran records (Super Admin, Supervisor, Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'tahun', required: false, type: Number })
  @ApiQuery({ name: 'bulan', required: false, type: Number })
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('tahun') tahun?: number,
    @Query('bulan') bulan?: number,
  ) {
    return this.iuranService.findAll(page, limit, status, tahun, bulan);
  }

  /**
   * Get iuran by ID
   * @param id - Iuran ID
   */
  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA)
  @Throttle('medium')
  @ApiOperation({ summary: 'Get iuran by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.iuranService.findOne(id);
  }

  /**
   * Create a new iuran record
   * @param createIuranDto - Iuran data
   */
  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle('medium')
  @ApiOperation({ summary: 'Create a new iuran record (Super Admin, Supervisor, Admin)' })
  async create(@Body() createIuranDto: CreateIuranDto, @Request() req) {
    return this.iuranService.create(createIuranDto, req.user);
  }

  /**
   * Update an iuran record
   * @param id - Iuran ID
   * @param updateIuranDto - Updated iuran data
   */
  @Put(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle('medium')
  @ApiOperation({ summary: 'Update an iuran record (Super Admin, Supervisor, Admin)' })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateIuranDto: UpdateIuranDto,
    @Request() req,
  ) {
    return this.iuranService.update(id, updateIuranDto, req.user);
  }

  /**
   * Delete an iuran record
   * @param id - Iuran ID
   */
  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle('medium')
  @ApiOperation({ summary: 'Delete an iuran record (Super Admin & Supervisor only)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string, @Request() req) {
    return this.iuranService.remove(id, req.user);
  }

  /**
   * Get iuran history for a user
   * @param userId - User ID
   */
  @Get('user/:userId')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA)
  @Throttle('medium')
  @ApiOperation({ summary: 'Get iuran history for a user' })
  @ApiParam({ name: 'userId', type: String })
  async findByUser(@Param('userId') userId: string, @Request() req) {
    return this.iuranService.findByUser(userId);
  }

  /**
   * Get iuran report (summary)
   * @param tahun - Year (optional)
   * @param bulan - Month (optional)
   */
  @Get('report')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle('medium')
  @ApiOperation({ summary: 'Get iuran report (Super Admin, Supervisor, Admin)' })
  @ApiQuery({ name: 'tahun', required: false, type: Number })
  @ApiQuery({ name: 'bulan', required: false, type: Number })
  async getReport(
    @Query('tahun') tahun?: number,
    @Query('bulan') bulan?: number,
    @Request() req,
  ) {
    return this.iuranService.getReport(tahun, bulan);
  }
}
