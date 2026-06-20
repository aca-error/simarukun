/**
 * Unit Tests for AuditController
 * 
 * @package SimaRukun
 * @subpackage Backend/Audit
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { UserRole } from '../../common/enums/user-role.enum';

// Mock AuditService
const mockAuditService = {
  getAuditLogs: jest.fn(),
  getRecentAuditLogs: jest.fn(),
  getAuditLogsByAction: jest.fn(),
};

// Mock Request object with Super Admin role
const mockSuperAdminRequest = {
  user: {
    sub: '1',
    email: 'superadmin@example.com',
    role: UserRole.SUPERADMIN,
  },
};

// Mock Request object with Supervisor role
const mockSupervisorRequest = {
  user: {
    sub: '2',
    email: 'supervisor@example.com',
    role: UserRole.SUPERVISOR,
  },
};

describe('AuditController', () => {
  let controller: AuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs for Super Admin', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: { path: '/auth/login' },
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: { id: '1', email: 'test@example.com' },
          createdAt: new Date(),
        },
      ];

      mockAuditService.getAuditLogs.mockResolvedValue({
        data: mockAuditLogs,
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.getAuditLogs(mockSuperAdminRequest as any, 1, 10);

      expect(result).toEqual({
        data: mockAuditLogs,
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockAuditService.getAuditLogs).toHaveBeenCalledWith('1', 1, 10);
    });

    it('should return audit logs filtered by user ID', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: { path: '/auth/login' },
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: { id: '1', email: 'test@example.com' },
          createdAt: new Date(),
        },
      ];

      mockAuditService.getAuditLogs.mockResolvedValue({
        data: mockAuditLogs,
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.getAuditLogs(mockSuperAdminRequest as any, 1, 10);

      expect(mockAuditService.getAuditLogs).toHaveBeenCalledWith('1', 1, 10);
    });

    it('should respect pagination parameters', async () => {
      const mockAuditLogs = [];

      mockAuditService.getAuditLogs.mockResolvedValue({
        data: mockAuditLogs,
        total: 0,
        page: 2,
        limit: 20,
      });

      const result = await controller.getAuditLogs(mockSuperAdminRequest as any, 2, 20);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(mockAuditService.getAuditLogs).toHaveBeenCalledWith('1', 2, 20);
    });
  });

  describe('getRecentAuditLogs', () => {
    it('should return recent audit logs for Super Admin', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: { path: '/auth/login' },
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: { id: '1', email: 'test@example.com' },
          createdAt: new Date(),
        },
      ];

      mockAuditService.getRecentAuditLogs.mockResolvedValue(mockAuditLogs);

      const result = await controller.getRecentAuditLogs(mockSuperAdminRequest as any, 5);

      expect(result).toEqual(mockAuditLogs);
      expect(mockAuditService.getRecentAuditLogs).toHaveBeenCalledWith(5);
    });

    it('should return recent audit logs for Supervisor', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: { path: '/auth/login' },
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: { id: '2', email: 'supervisor@example.com' },
          createdAt: new Date(),
        },
      ];

      mockAuditService.getRecentAuditLogs.mockResolvedValue(mockAuditLogs);

      const result = await controller.getRecentAuditLogs(mockSupervisorRequest as any, 5);

      expect(result).toEqual(mockAuditLogs);
    });

    it('should use default count if not provided', async () => {
      const mockAuditLogs = [];

      mockAuditService.getRecentAuditLogs.mockResolvedValue(mockAuditLogs);

      const result = await controller.getRecentAuditLogs(mockSuperAdminRequest as any);

      expect(mockAuditService.getRecentAuditLogs).toHaveBeenCalledWith(10);
    });
  });

  describe('getAuditLogsByAction', () => {
    it('should return audit logs filtered by action for Super Admin', async () => {
      const mockAuditLogs = [
        {
          id: '1',
          action: 'LOGIN',
          metadata: { path: '/auth/login' },
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          user: { id: '1', email: 'test@example.com' },
          createdAt: new Date(),
        },
      ];

      mockAuditService.getAuditLogsByAction.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogsByAction(mockSuperAdminRequest as any, 'LOGIN');

      expect(result).toEqual(mockAuditLogs);
      expect(mockAuditService.getAuditLogsByAction).toHaveBeenCalledWith('LOGIN');
    });

    it('should return audit logs for CREATE action', async () => {
      const mockAuditLogs = [];

      mockAuditService.getAuditLogsByAction.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogsByAction(mockSuperAdminRequest as any, 'CREATE');

      expect(mockAuditService.getAuditLogsByAction).toHaveBeenCalledWith('CREATE');
    });

    it('should return audit logs for DELETE action', async () => {
      const mockAuditLogs = [];

      mockAuditService.getAuditLogsByAction.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogsByAction(mockSuperAdminRequest as any, 'DELETE');

      expect(mockAuditService.getAuditLogsByAction).toHaveBeenCalledWith('DELETE');
    });
  });
});
