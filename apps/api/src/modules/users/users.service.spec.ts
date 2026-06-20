/**
 * Unit Tests for UsersService
 * 
 * @package SimaRukun
 * @subpackage Backend/Users
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, Like } from 'typeorm';

// Mock repository
const mockUsersRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users without password', async () => {
      const mockUsers = [
        {
          id: '1',
          nama: 'User 1',
          email: 'user1@example.com',
          password: 'hashed-password',
          role: UserRole.WARGA,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          nama: 'User 2',
          email: 'user2@example.com',
          password: 'hashed-password',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: [
          {
            id: '1',
            nama: 'User 1',
            email: 'user1@example.com',
            role: UserRole.WARGA,
            isActive: true,
            createdAt: mockUsers[0].createdAt,
            updatedAt: mockUsers[0].updatedAt,
          },
          {
            id: '2',
            nama: 'User 2',
            email: 'user2@example.com',
            role: UserRole.ADMIN,
            isActive: true,
            createdAt: mockUsers[1].createdAt,
            updatedAt: mockUsers[1].updatedAt,
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(mockUsersRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter by role', async () => {
      const mockUser = {
        id: '1',
        nama: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed-password',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.findAll(1, 10, UserRole.ADMIN);

      expect(result.total).toBe(1);
      expect(mockUsersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: UserRole.ADMIN }),
        }),
      );
    });

    it('should filter by isActive', async () => {
      const mockUser = {
        id: '1',
        nama: 'Active User',
        email: 'active@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.findAll(1, 10, undefined, true);

      expect(result.total).toBe(1);
      expect(mockUsersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return user without password if found', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual({
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user with password if found', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return user without password', async () => {
      const createUserDto = {
        nama: 'New User',
        email: 'new@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
      };

      const mockUser = {
        id: '1',
        ...createUserDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockReturnValue(createUserDto);
      mockUsersRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        id: '1',
        nama: 'New User',
        email: 'new@example.com',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        nama: 'New User',
        email: 'existing@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
      };

      const mockUser = {
        id: '1',
        email: 'existing@example.com',
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('update', () => {
    it('should update and return user without password', async () => {
      const updateUserDto = {
        nama: 'Updated User',
        email: 'updated@example.com',
      };

      const existingUser = {
        id: '1',
        nama: 'Old User',
        email: 'old@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = {
        id: '1',
        nama: 'Updated User',
        email: 'updated@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: existingUser.createdAt,
        updatedAt: new Date(),
      };

      mockUsersRepository.findOneBy.mockResolvedValue(existingUser);
      mockUsersRepository.merge.mockReturnValue(updatedUser);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual({
        id: '1',
        nama: 'Updated User',
        email: 'updated@example.com',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockUsersRepository.merge).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('999', { nama: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update('999', { nama: 'Updated' })).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = {
        id: '1',
        email: 'old@example.com',
      };

      const otherUser = {
        id: '2',
        email: 'existing@example.com',
      };

      mockUsersRepository.findOneBy
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(otherUser);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('remove', () => {
    it('should delete and return user without password', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);
      mockUsersRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(result).toEqual({
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockUsersRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      await expect(service.remove('999')).rejects.toThrow('User not found');
    });
  });

  describe('toggleActive', () => {
    it('should toggle user active status', async () => {
      const mockUser = {
        id: '1',
        nama: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: UserRole.WARGA,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = {
        ...mockUser,
        isActive: false,
        updatedAt: new Date(),
      };

      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.toggleActive('1');

      expect(result.isActive).toBe(false);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.toggleActive('999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.toggleActive('999')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('search', () => {
    it('should return users matching search query', async () => {
      const mockUsers = [
        {
          id: '1',
          nama: 'Test User',
          email: 'test@example.com',
          password: 'hashed-password',
          role: UserRole.WARGA,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersRepository.find.mockResolvedValue(mockUsers);

      const result = await service.search('Test');

      expect(result).toEqual([
        {
          id: '1',
          nama: 'Test User',
          email: 'test@example.com',
          role: UserRole.WARGA,
          isActive: true,
          createdAt: mockUsers[0].createdAt,
          updatedAt: mockUsers[0].updatedAt,
        },
      ]);
      expect(mockUsersRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.arrayContaining([
            expect.objectContaining({ nama: Like('%Test%') }),
            expect.objectContaining({ email: Like('%Test%') }),
          ]),
          take: 10,
        }),
      );
    });
  });

  describe('updateRefreshToken', () => {
    it('should update user refresh token', async () => {
      mockUsersRepository.update.mockResolvedValue(undefined);

      await service.updateRefreshToken('1', 'new-refresh-token');

      expect(mockUsersRepository.update).toHaveBeenCalledWith('1', {
        refreshToken: 'new-refresh-token',
      });
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear user refresh token', async () => {
      mockUsersRepository.update.mockResolvedValue(undefined);

      await service.clearRefreshToken('1');

      expect(mockUsersRepository.update).toHaveBeenCalledWith('1', {
        refreshToken: null,
      });
    });
  });

  describe('findByRole', () => {
    it('should return users with specified role', async () => {
      const mockUser = {
        id: '1',
        nama: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed-password',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersRepository.findBy.mockResolvedValue([mockUser]);

      const result = await service.findByRole(UserRole.ADMIN);

      expect(result).toEqual([
        {
          id: '1',
          nama: 'Admin User',
          email: 'admin@example.com',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      ]);
      expect(mockUsersRepository.findBy).toHaveBeenCalledWith({ role: UserRole.ADMIN });
    });
  });
});
