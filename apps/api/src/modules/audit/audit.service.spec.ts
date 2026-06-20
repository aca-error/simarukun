/**
 * Unit Tests for AuditService
 * 
 * @package SimaRukun
 * @subpackage Backend/Audit
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './audit.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

// Mock repository
const mockAuditLogRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  find: jest.fn(),
};

// Mock user for testing
const mockUser: User = {
  id: '1',
  nama: 'Test User',
  email: 'test@example.com',
  password: 'hashed-password',
  role: 'admin' as any,
  isActive: true,
  refreshToken: null,
  phone: null,
  address: null,
  rt: null,
  rw: null,
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  auditLogs: [],
  iurans: [],
  aduans: [],
};

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditLogRepository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logAction', () => {
    it('should create and save audit log', async () => {
      const mockAuditLog = {
        id: '1',
        action: 'CREATE',
        metadata: { path: '/users', data: { name: 'Test' } },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        user: mockUser,
        createdAt: new Date(),
      };

      mockAuditLogRepository.create.mockReturnValue(mockAuditLog);
      mockAuditLogRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.logAction(
        'CREATE',
        mockUser,
        { path: '/users', data: { name: 'Test' } },
        '127.0.0.1',
        'Mozilla/5.0',
      );

      expect(result).toEqual(mockAuditLog);
      expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
        action: 'CREATE',
        metadata: { path: '/users', data: { name: 'Test' } },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        user: mockUser,
      });
      expect(mockAuditLogRepository.save).toHaveBeenCalledWith(mockAuditLog);
    });

    it('should create audit log without user', async () => {
      const mockAuditLog = {
        id: '1',
        action: 'LOGIN',
        metadata: { path: '/auth/login', data: { email: 'test@example.com' } },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        user: null,
        createdAt: new Date(),
      };

      mockAuditLogRepository.create.mockReturnValue(mockAuditLog);
      mockAuditLogRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.logAction(
        'LOGIN',
        null,
        { path: '/auth/login', data: { email: 'test@example.com' } },
        '127.0.0.1',
        'Mozilla/5.0',
      );

      expect(result).toEqual(mockAuditLog);
      expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
        action: 'LOGIN',
        metadata: { path: '/auth/login', data: { email: 'test@example.com' } },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        user: null,
      });
    });

    it('should create audit log with default values for null parameters', async () => {
      const mockAuditLog = {
        id: '1',
        action: 'DELETE',
        metadata: {},
        ipAddress: null,
        userAgent: null,
        user: mockUser,
        createdAt: new Date(),
      };

      mockAuditLogRepository.create.mockReturnValue(mockAuditLog);
      mockAuditLogRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.logAction('DELETE', mockUser);

      expect(result).toEqual(mockAuditLog);
      expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
        action: 'DELETE',
        metadata: {},
        ipAddress: null,
        userAgent: null,
        user: mockUser,
      });
    });
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs for specific user', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'CREATE',
          metadata: {},
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: mockUser,
          createdAt: new Date(),
        },
        {
          id: '2',
          action: 'UPDATE',
          metadata: {},
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: mockUser,
          createdAt: new Date(),
        },
      ];

      mockAuditLogRepository.findAndCount.mockResolvedValue([mockAuditLogs, 2]);

      const result = await service.getAuditLogs('1', 1, 10);

      expect(result).toEqual({
        data: mockAuditLogs,
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(mockAuditLogRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: '1' } },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
        relations: ['user'],
      });
    });

    it('should return all audit logs if userId is not provided', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: {},
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: mockUser,
          createdAt: new Date(),
        },
      ];

      mockAuditLogRepository.findAndCount.mockResolvedValue([mockAuditLogs, 1]);

      const result = await service.getAuditLogs(undefined, 1, 10);

      expect(result.total).toBe(1);
      expect(mockAuditLogRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
        relations: ['user'],
      });
    });

    it('should respect pagination parameters', async () => {
      const mockAuditLogs = [];

      mockAuditLogRepository.findAndCount.mockResolvedValue([mockAuditLogs, 0]);

      await service.getAuditLogs('1', 2, 20);

      expect(mockAuditLogRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: '1' } },
        order: { createdAt: 'DESC' },
        skip: 20, // (2 - 1) * 20 = 20
        take: 20,
        relations: ['user'],
      });
    });
  });

  describe('getAuditLogsByAction', () => {
    it('should return audit logs filtered by action', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: {},
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: mockUser,
          createdAt: new Date(),
        },
      ];

      mockAuditLogRepository.find.mockResolvedValue(mockAuditLogs);

      const result = await service.getAuditLogsByAction('LOGIN');

      expect(result).toEqual(mockAuditLogs);
      expect(mockAuditLogRepository.find).toHaveBeenCalledWith({
        where: { action: 'LOGIN' },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
    });
  });

  describe('getRecentAuditLogs', () => {
    it('should return recent audit logs with default count', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: {},
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: mockUser,
          createdAt: new Date(),
        },
      ];

      mockAuditLogRepository.find.mockResolvedValue(mockAuditLogs);

      const result = await service.getRecentAuditLogs();

      expect(result).toEqual(mockAuditLogs);
      expect(mockAuditLogRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 10,
        relations: ['user'],
      });
    });

    it('should respect custom count parameter', async () => {
      const mockAuditLogs = [];

      mockAuditLogRepository.find.mockResolvedValue(mockAuditLogs);

      await service.getRecentAuditLogs(5);

      expect(mockAuditLogRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user'],
      });
    });
  });
});
