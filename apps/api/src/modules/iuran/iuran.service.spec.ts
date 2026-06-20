/**
 * Unit Tests for IuranService
 * 
 * @package SimaRukun
 * @subpackage Backend/Iuran
 */

import { Test, TestingModule } from '@nestjs/testing';
import { IuranService } from './iuran.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Iuran } from './entities/iuran.entity';
import { User } from '../users/entities/user.entity';
import { Repository, FindOptionsWhere, Between, LessThan } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

// Mock repository
const mockIuranRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
};

// Mock user for testing
const mockUser: User = {
  id: '1',
  nama: 'Test User',
  email: 'test@example.com',
  password: 'hashed-password',
  role: UserRole.ADMIN,
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

const mockSuperAdminUser: User = {
  ...mockUser,
  id: 'superadmin-1',
  role: UserRole.SUPERADMIN,
};

const mockWargaUser: User = {
  ...mockUser,
  id: 'warga-1',
  role: UserRole.WARGA,
};

// Mock Iuran entity
const mockIuran: Iuran = {
  id: 'iuran-1',
  judul: 'Iuran Bulanan',
  deskripsi: 'Iuran bulanan RT 01',
  jumlah: 100000,
  tanggalJatuhTempo: new Date('2026-07-01'),
  status: 'BELUM_BAYAR',
  tanggalPembayaran: null,
  buktiPembayaran: null,
  catatan: null,
  user: mockUser,
  userId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('IuranService', () => {
  let service: IuranService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IuranService,
        {
          provide: getRepositoryToken(Iuran),
          useValue: mockIuranRepository,
        },
      ],
    }).compile();

    service = module.get<IuranService>(IuranService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated iuran records', async () => {
      const mockIurans = [mockIuran, {
        ...mockIuran,
        id: 'iuran-2',
        judul: 'Iuran Kebersihan',
      }];

      mockIuranRepository.findAndCount.mockResolvedValue([mockIurans, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockIurans,
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(mockIuranRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { tanggalJatuhTempo: 'DESC', createdAt: 'DESC' },
        skip: 0,
        take: 10,
        relations: ['user'],
      });
    });

    it('should filter by status', async () => {
      mockIuranRepository.findAndCount.mockResolvedValue([[mockIuran], 1]);

      const result = await service.findAll(1, 10, 'SUDAH_BAYAR');

      expect(result.total).toBe(1);
      expect(mockIuranRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'SUDAH_BAYAR' }),
        }),
      );
    });

    it('should filter by tahun and bulan', async () => {
      const startDate = new Date(2026, 5, 1); // Juni 2026
      const endDate = new Date(2026, 6, 0); // Akhir Juni 2026

      mockIuranRepository.findAndCount.mockResolvedValue([[mockIuran], 1]);

      await service.findAll(1, 10, undefined, 2026, 6);

      expect(mockIuranRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tanggalJatuhTempo: Between(startDate, endDate),
          }),
        }),
      );
    });

    it('should filter by tahun only', async () => {
      const startDate = new Date(2026, 0, 1); // Januari 2026
      const endDate = new Date(2026, 11, 31); // Desember 2026

      mockIuranRepository.findAndCount.mockResolvedValue([[mockIuran], 1]);

      await service.findAll(1, 10, undefined, 2026);

      expect(mockIuranRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tanggalJatuhTempo: Between(startDate, endDate),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return iuran if found', async () => {
      mockIuranRepository.findOne.mockResolvedValue(mockIuran);

      const result = await service.findOne('iuran-1');

      expect(result).toEqual(mockIuran);
      expect(mockIuranRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'iuran-1' },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if iuran not found', async () => {
      mockIuranRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('iuran-999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('iuran-999')).rejects.toThrow('Iuran not found');
    });
  });

  describe('create', () => {
    it('should create and return new iuran', async () => {
      const createIuranDto = {
        judul: 'Iuran Bulanan',
        deskripsi: 'Iuran bulanan RT 01',
        jumlah: 100000,
        tanggalJatuhTempo: '2026-07-01',
        status: 'BELUM_BAYAR' as const,
      };

      const newIuran = {
        ...mockIuran,
        ...createIuranDto,
        id: 'iuran-new',
        user: mockUser,
        userId: mockUser.id,
        tanggalJatuhTempo: new Date('2026-07-01'),
      };

      mockIuranRepository.create.mockReturnValue(newIuran);
      mockIuranRepository.save.mockResolvedValue(newIuran);

      const result = await service.create(createIuranDto, mockUser);

      expect(result).toEqual(newIuran);
      expect(mockIuranRepository.create).toHaveBeenCalledWith({
        ...createIuranDto,
        user: mockUser,
        userId: mockUser.id,
        tanggalJatuhTempo: new Date('2026-07-01'),
      });
      expect(mockIuranRepository.save).toHaveBeenCalledWith(newIuran);
    });
  });

  describe('update', () => {
    it('should update iuran if user is owner', async () => {
      const updateIuranDto = {
        judul: 'Iuran Bulanan Updated',
        jumlah: 150000,
      };

      const updatedIuran = {
        ...mockIuran,
        ...updateIuranDto,
      };

      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.merge.mockReturnValue(updatedIuran);
      mockIuranRepository.save.mockResolvedValue(updatedIuran);

      const result = await service.update('iuran-1', updateIuranDto, mockUser);

      expect(result).toEqual(updatedIuran);
      expect(mockIuranRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'iuran-1' },
        relations: ['user'],
      });
    });

    it('should update iuran if user is SUPERADMIN', async () => {
      const updateIuranDto = { judul: 'Updated' };
      const updatedIuran = { ...mockIuran, ...updateIuranDto };

      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.merge.mockReturnValue(updatedIuran);
      mockIuranRepository.save.mockResolvedValue(updatedIuran);

      const result = await service.update('iuran-1', updateIuranDto, mockSuperAdminUser);

      expect(result).toEqual(updatedIuran);
    });

    it('should update iuran if user is SUPERVISOR', async () => {
      const supervisorUser = { ...mockUser, role: UserRole.SUPERVISOR };
      const updateIuranDto = { judul: 'Updated' };
      const updatedIuran = { ...mockIuran, ...updateIuranDto };

      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.merge.mockReturnValue(updatedIuran);
      mockIuranRepository.save.mockResolvedValue(updatedIuran);

      const result = await service.update('iuran-1', updateIuranDto, supervisorUser);

      expect(result).toEqual(updatedIuran);
    });

    it('should throw NotFoundException if iuran not found', async () => {
      mockIuranRepository.findOne.mockResolvedValue(null);

      await expect(service.update('iuran-999', {}, mockUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin', async () => {
      const otherIuran = { ...mockIuran, userId: 'other-user-id' };
      mockIuranRepository.findOne.mockResolvedValue(otherIuran);

      await expect(service.update('iuran-1', {}, mockWargaUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove iuran if user is owner', async () => {
      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.remove.mockResolvedValue(mockIuran);

      const result = await service.remove('iuran-1', mockUser);

      expect(result).toEqual(mockIuran);
      expect(mockIuranRepository.remove).toHaveBeenCalledWith(mockIuran);
    });

    it('should remove iuran if user is SUPERADMIN', async () => {
      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.remove.mockResolvedValue(mockIuran);

      const result = await service.remove('iuran-1', mockSuperAdminUser);

      expect(result).toEqual(mockIuran);
    });

    it('should remove iuran if user is SUPERVISOR', async () => {
      const supervisorUser = { ...mockUser, role: UserRole.SUPERVISOR };
      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.remove.mockResolvedValue(mockIuran);

      const result = await service.remove('iuran-1', supervisorUser);

      expect(result).toEqual(mockIuran);
    });

    it('should throw NotFoundException if iuran not found', async () => {
      mockIuranRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('iuran-999', mockSuperAdminUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin', async () => {
      const otherIuran = { ...mockIuran, userId: 'other-user-id' };
      mockIuranRepository.findOne.mockResolvedValue(otherIuran);

      await expect(service.remove('iuran-1', mockWargaUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUser', () => {
    it('should return iuran records for specific user', async () => {
      mockIuranRepository.find.mockResolvedValue([mockIuran]);

      const result = await service.findByUser('1');

      expect(result).toEqual([mockIuran]);
      expect(mockIuranRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: { tanggalJatuhTempo: 'DESC', createdAt: 'DESC' },
        relations: ['user'],
      });
    });
  });

  describe('getReport', () => {
    it('should return iuran report for specific tahun and bulan', async () => {
      const mockIurans = [
        { ...mockIuran, status: 'SUDAH_BAYAR', jumlah: 100000 },
        { ...mockIuran, id: 'iuran-2', status: 'BELUM_BAYAR', jumlah: 150000 },
        { ...mockIuran, id: 'iuran-3', status: 'TELAT', jumlah: 50000 },
      ];

      mockIuranRepository.find.mockResolvedValue(mockIurans);

      const result = await service.getReport(2026, 6);

      expect(result).toEqual({
        totalIuran: 3,
        totalDibayar: 1,
        totalBelumDibayar: 1,
        totalTelat: 1,
        totalJumlah: 300000,
        totalJumlahDibayar: 100000,
        totalJumlahBelumDibayar: 200000,
      });
    });

    it('should return iuran report for specific tahun only', async () => {
      const mockIurans = [
        { ...mockIuran, status: 'SUDAH_BAYAR', jumlah: 100000 },
        { ...mockIuran, id: 'iuran-2', status: 'BELUM_BAYAR', jumlah: 150000 },
      ];

      mockIuranRepository.find.mockResolvedValue(mockIurans);

      const result = await service.getReport(2026);

      expect(result.totalIuran).toBe(2);
      expect(result.totalJumlah).toBe(250000);
    });

    it('should return iuran report for all data if no filters', async () => {
      const mockIurans = [mockIuran];

      mockIuranRepository.find.mockResolvedValue(mockIurans);

      const result = await service.getReport();

      expect(result.totalIuran).toBe(1);
      expect(mockIuranRepository.find).toHaveBeenCalledWith({ where: {} });
    });
  });

  describe('updateStatus', () => {
    it('should update iuran status if user is owner', async () => {
      const updatedIuran = { ...mockIuran, status: 'SUDAH_BAYAR' };

      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.save.mockResolvedValue(updatedIuran);

      const result = await service.updateStatus('iuran-1', 'SUDAH_BAYAR', mockUser);

      expect(result).toEqual(updatedIuran);
      expect(updatedIuran.status).toBe('SUDAH_BAYAR');
    });

    it('should set tanggalPembayaran if status is SUDAH_BAYAR and not provided', async () => {
      const updatedIuran = {
        ...mockIuran,
        status: 'SUDAH_BAYAR',
        tanggalPembayaran: expect.any(Date),
      };

      mockIuranRepository.findOne.mockResolvedValue(mockIuran);
      mockIuranRepository.save.mockImplementation((iuran) => Promise.resolve({
        ...iuran,
        tanggalPembayaran: new Date(),
      }));

      const result = await service.updateStatus('iuran-1', 'SUDAH_BAYAR', mockUser);

      expect(result.status).toBe('SUDAH_BAYAR');
      expect(result.tanggalPembayaran).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if iuran not found', async () => {
      mockIuranRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus('iuran-999', 'SUDAH_BAYAR', mockSuperAdminUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin', async () => {
      const otherIuran = { ...mockIuran, userId: 'other-user-id' };
      mockIuranRepository.findOne.mockResolvedValue(otherIuran);

      await expect(service.updateStatus('iuran-1', 'SUDAH_BAYAR', mockWargaUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOverdue', () => {
    it('should return overdue iuran records', async () => {
      const overdueIuran = {
        ...mockIuran,
        tanggalJatuhTempo: new Date('2026-01-01'), // Sudah lewat
        status: 'BELUM_BAYAR',
      };

      mockIuranRepository.find.mockResolvedValue([overdueIuran]);

      const result = await service.findOverdue();

      expect(result).toEqual([overdueIuran]);
      expect(mockIuranRepository.find).toHaveBeenCalledWith({
        where: {
          tanggalJatuhTempo: LessThan(expect.any(Date)),
          status: 'BELUM_BAYAR',
        },
        order: { tanggalJatuhTempo: 'ASC' },
        relations: ['user'],
      });
    });
  });

  describe('findByDateRange', () => {
    it('should return iuran records within date range', async () => {
      const startDate = new Date('2026-06-01');
      const endDate = new Date('2026-06-30');

      mockIuranRepository.find.mockResolvedValue([mockIuran]);

      const result = await service.findByDateRange(startDate, endDate);

      expect(result).toEqual([mockIuran]);
      expect(mockIuranRepository.find).toHaveBeenCalledWith({
        where: {
          tanggalJatuhTempo: Between(startDate, endDate),
        },
        order: { tanggalJatuhTempo: 'ASC' },
        relations: ['user'],
      });
    });
  });
});
