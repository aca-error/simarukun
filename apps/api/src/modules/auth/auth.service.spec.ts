/**
 * Unit Tests for AuthService
 * 
 * @package SimaRukun
 * @subpackage Backend/Auth
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from '@node-rs/argon2';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

// Mock argon2
jest.mock('@node-rs/argon2');

// Mock UsersService
const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateRefreshToken: jest.fn(),
  clearRefreshToken: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
  sign: jest.fn(),
};

// Mock ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'JWT_SECRET':
        return 'test-secret';
      case 'JWT_EXPIRES_IN':
        return '15m';
      case 'JWT_REFRESH_EXPIRES_IN':
        return '7d';
      default:
        return null;
    }
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        nama: 'Test User',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        nama: 'Test User',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: mockUser.createdAt,
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'password123');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.validateUser('nonexistent@example.com', 'password123'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrong-password'))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.validateUser('test@example.com', 'wrong-password'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('login', () => {
    it('should return access token, refresh token, and user data on successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        nama: 'Test User',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('test-access-token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-access-token', // Same for refresh in this mock
        user: {
          id: '1',
          email: 'test@example.com',
          nama: 'Test User',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: mockUser.createdAt,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a new user and return tokens', async () => {
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        password: 'hashed-password',
        nama: 'New User',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('test-token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.register(
        'New User',
        'new@example.com',
        'password123',
        UserRole.WARGA,
      );

      expect(result).toEqual({
        accessToken: 'test-token',
        refreshToken: 'test-token',
        user: {
          id: '1',
          email: 'new@example.com',
          nama: 'New User',
          role: UserRole.WARGA,
          isActive: true,
          createdAt: mockUser.createdAt,
        },
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const mockUser = {
        id: '1',
        email: 'existing@example.com',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register('New User', 'existing@example.com', 'password123'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.register('New User', 'existing@example.com', 'password123'),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const tokens = await service.generateTokens('1', 'test@example.com', UserRole.WARGA);

      expect(tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token if refresh token is valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        refreshToken: 'valid-refresh-token',
        role: UserRole.WARGA,
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken('1', 'valid-refresh-token');

      expect(result).toEqual({
        accessToken: 'new-access-token',
      });
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken('999', 'token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        refreshToken: 'valid-refresh-token',
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      await expect(
        service.refreshToken('1', 'invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      mockUsersService.clearRefreshToken.mockResolvedValue(undefined);

      await service.logout('1');

      expect(mockUsersService.clearRefreshToken).toHaveBeenCalledWith('1');
    });
  });

  describe('validateJwtPayload', () => {
    it('should return user without password if user exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        nama: 'Test User',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.validateJwtPayload({
        sub: '1',
        email: 'test@example.com',
        role: UserRole.WARGA,
      });

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        nama: 'Test User',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.validateJwtPayload({
          sub: '999',
          email: 'test@example.com',
          role: UserRole.WARGA,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
