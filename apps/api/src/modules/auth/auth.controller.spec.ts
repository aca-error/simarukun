/**
 * Unit Tests for AuthController
 * 
 * @package SimaRukun
 * @subpackage Backend/Auth
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { HttpStatus } from '@nestjs/common';

// Mock AuthService
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  validateJwtPayload: jest.fn(),
};

// Mock Request object
const mockRequest = {
  user: {
    sub: '1',
    email: 'test@example.com',
    role: 'admin',
    refreshToken: 'refresh-token',
  },
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response with tokens and user data', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockLoginResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          nama: 'Test User',
          role: 'admin' as const,
          isActive: true,
          createdAt: new Date(),
        },
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(email, password);

      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(email, password);
    });
  });

  describe('register', () => {
    it('should return login response after registration', async () => {
      const nama = 'New User';
      const email = 'new@example.com';
      const password = 'password123';
      const role = 'warga';

      const mockLoginResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'new@example.com',
          nama: 'New User',
          role: 'warga' as const,
          isActive: true,
          createdAt: new Date(),
        },
      };

      mockAuthService.register.mockResolvedValue(mockLoginResponse);

      const result = await controller.register(nama, email, password, role);

      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(nama, email, password, role);
    });

    it('should register with default role (WARGA) if role not provided', async () => {
      const nama = 'New User';
      const email = 'new@example.com';
      const password = 'password123';

      const mockLoginResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'new@example.com',
          nama: 'New User',
          role: 'warga' as const,
          isActive: true,
          createdAt: new Date(),
        },
      };

      mockAuthService.register.mockResolvedValue(mockLoginResponse);

      const result = await controller.register(nama, email, password);

      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(nama, email, password, undefined);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token', async () => {
      const mockTokens = {
        accessToken: 'new-access-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(mockTokens);

      const result = await controller.refreshToken(mockRequest as any);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        mockRequest.user.sub,
        mockRequest.user.refreshToken,
      );
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest as any);

      expect(result).toEqual({ message: 'Logout successful' });
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockRequest.user.sub);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nama: 'Test User',
        role: 'admin' as const,
        isActive: true,
        createdAt: new Date(),
      };

      mockAuthService.validateJwtPayload.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(mockAuthService.validateJwtPayload).toHaveBeenCalledWith({
        sub: mockRequest.user.sub,
        email: mockRequest.user.email,
        role: mockRequest.user.role,
      });
    });
  });
});
