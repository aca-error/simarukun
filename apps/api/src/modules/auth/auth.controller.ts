import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Put,
  Get,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginResponse } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login user
   */
  @Post('login')
  @Throttle(5, 1000)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<LoginResponse> {
    return this.authService.login(email, password);
  }

  /**
   * Register new user
   */
  @Post('register')
  @Throttle(5, 1000)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama: { type: 'string', minLength: 2, maxLength: 100 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        role: { type: 'string', enum: ['SUPERADMIN', 'SUPERVISOR', 'ADMIN', 'WARGA'] },
      },
      required: ['nama', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body('nama') nama: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role?: string,
  ): Promise<LoginResponse> {
    return this.authService.register(nama, email, password, role as any);
  }

  /**
   * Refresh access token
   */
  @Post('refresh')
  @Throttle(100, 60000)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Request() req): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(req.user.sub, req.user.refreshToken);
  }

  /**
   * Logout user
   */
  @Post('logout')
  @Throttle(100, 60000)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req): Promise<{ message: string }> {
    await this.authService.logout(req.user.sub);
    return { message: 'Logout successful' };
  }

  /**
   * Get current user profile
   */
  @Get('profile')
  @Throttle(100, 60000)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.authService.validateJwtPayload({
      sub: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    });
  }
}
