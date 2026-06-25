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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { AduanService } from './aduan.service';
import { CreateAduanDto } from './dto/create-aduan.dto';
import { UpdateAduanDto } from './dto/update-aduan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Aduan')
@Controller('aduan')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AduanController {
  constructor(private readonly aduanService: AduanService) {}

  /**
   * Get all aduan records (with pagination)
   */
  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Get all aduan records (Super Admin, Supervisor, Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'kategori', required: false, type: String })
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('kategori') kategori?: string,
  ) {
    return this.aduanService.findAll(page, limit, status, kategori);
  }

  /**
   * Get aduan statistics
   */
  @Get('stats')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Get aduan statistics (Super Admin, Supervisor, Admin)' })
  async getStats(@Request() req) {
    return this.aduanService.getStats();
  }

  /**
   * Get aduan by user
   */
  @Get('user/:userId')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Get aduan by user' })
  @ApiParam({ name: 'userId', type: String })
  async findByUser(@Param('userId') userId: string, @Request() req) {
    return this.aduanService.findByUser(userId);
  }

  /**
   * Get aduan by ID
   */
  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Get aduan by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.aduanService.findOne(id);
  }

  /**
   * Create a new aduan
   */
  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.WARGA)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Create a new aduan' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createAduanDto: CreateAduanDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.aduanService.create(createAduanDto, file, req.user);
  }

  /**
   * Update aduan status
   */
  @Put(':id/status')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Update aduan status (Super Admin, Supervisor, Admin)' })
  @ApiParam({ name: 'id', type: String })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.aduanService.updateStatus(id, status, req.user);
  }

  /**
   * Update an aduan
   */
  @Put(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Update an aduan (Super Admin, Supervisor, Admin)' })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateAduanDto: UpdateAduanDto,
    @Request() req,
  ) {
    return this.aduanService.update(id, updateAduanDto, req.user);
  }

  /**
   * Delete an aduan
   */
  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle(100, 60000)
  @ApiOperation({ summary: 'Delete an aduan (Super Admin & Supervisor only)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string, @Request() req) {
    return this.aduanService.remove(id, req.user);
  }
}
