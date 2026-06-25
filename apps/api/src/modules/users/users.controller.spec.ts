/**
 * Unit Tests for UsersController
 * 
 * @package SimaRukun
 * @subpackage Backend/Users
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// Mock UsersService
const mockUsersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  toggleActive: jest.fn(),
  search: jest.fn(),
};

// Mock Request object
const mockRequest = {
  user: {
    sub: '1',
    email: 'test@example.com',
    role: UserRole.SUPERADMIN,
  },
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: '1',
          nama: 'User 1',
          email: 'user1@example.com',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.findAll.mockResolvedValue({
        data: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.findAll(mockRequest as any, 1, 10, UserRole.ADMIN, true);

      expect(result).toEqual({
        data: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockUsersService.findAll).toHaveBeenCalledWith(1, 10, UserRole.ADMIN, true);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne('1', mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        nama: 'New User',
        email: 'new@example.com',
        password: 'password123',
        role: UserRole.WARGA,
      };

      const mockUser = {
        id: '1',
        ...createUserDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto, mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        nama: 'Updated User',
        email: 'updated@example.com',
      };

      const mockUser = {
        id: '1',
        nama: 'Updated User',
        email: 'updated@example.com',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updateUserDto, mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove('1', mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('toggleActive', () => {
    it('should toggle user active status', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.toggleActive.mockResolvedValue(mockUser);

      const result = await controller.toggleActive('1', mockRequest as any);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.toggleActive).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search users by query', async () => {
      const mockUsers = [
        {
          id: '1',
          nama: 'Test User',
          email: 'test@example.com',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.search.mockResolvedValue(mockUsers);

      const result = await controller.search('Test', mockRequest as any);

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.search).toHaveBeenCalledWith('Test');
    });
  });
});
