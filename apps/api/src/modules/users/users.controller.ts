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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users (with pagination)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param role - Filter by role (optional)
   * @param isActive - Filter by active status (optional)
   */
  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle('medium') // Rate limiting: 100 requests per minute
  @ApiOperation({ summary: 'Get all users (Super Admin & Supervisor only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: UserRole,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.usersService.findAll(page, limit, role, isActive);
  }

  /**
   * Get user by ID
   * @param id - User ID
   */
  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN)
  @Throttle('medium')
  @ApiOperation({ summary: 'Get user by ID (Super Admin, Supervisor, Admin)' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(id);
  }

  /**
   * Create a new user
   * @param createUserDto - User data
   */
  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle('medium')
  @ApiOperation({ summary: 'Create a new user (Super Admin & Supervisor only)' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Update a user
   * @param id - User ID
   * @param updateUserDto - Updated user data
   */
  @Put(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle('medium')
  @ApiOperation({ summary: 'Update a user (Super Admin & Supervisor only)' })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user
   * @param id - User ID
   */
  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  @Throttle('medium')
  @ApiOperation({ summary: 'Delete a user (Super Admin only)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id);
  }

  /**
   * Toggle user active status
   * @param id - User ID
   */
  @Put(':id/toggle-active')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle('medium')
  @ApiOperation({ summary: 'Toggle user active status (Super Admin & Supervisor only)' })
  @ApiParam({ name: 'id', type: String })
  async toggleActive(@Param('id') id: string, @Request() req) {
    return this.usersService.toggleActive(id);
  }

  /**
   * Search users by name or email
   * @param query - Search query
   */
  @Get('search')
  @Roles(UserRole.SUPERADMIN, UserRole.SUPERVISOR)
  @Throttle('medium')
  @ApiOperation({ summary: 'Search users (Super Admin & Supervisor only)' })
  @ApiQuery({ name: 'q', required: true, type: String })
  async search(@Query('q') query: string, @Request() req) {
    return this.usersService.search(query);
  }
}
