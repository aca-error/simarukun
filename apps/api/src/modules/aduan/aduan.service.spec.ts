/**
 * Unit Tests for AduanService
 * 
 * @package SimaRukun
 * @subpackage Backend/Aduan
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AduanService } from './aduan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Aduan } from './entities/aduan.entity';
import { User } from '../users/entities/user.entity';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

// Mock repository
const mockAduanRepository = {
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

const mockSupervisorUser: User = {
  ...mockUser,
  id: 'supervisor-1',
  role: UserRole.SUPERVISOR,
};

const mockWargaUser: User = {
  ...mockUser,
  id: 'warga-1',
  role: UserRole.WARGA,
};

// Mock Aduan entity
const mockAduan: Aduan = {
  id: 'aduan-1',
  judul: 'Aduan Kebersihan',
  deskripsi: 'Lingkungan RT 01 kotor',
  kategori: 'KEBERSIHAN',
  lampiran: null,
  status: 'BARU',
  catatan: null,
  lokasi: 'RT 01',
  user: mockUser,
  userId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AduanService', () => {
  let service: AduanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AduanService,
        {
          provide: getRepositoryToken(Aduan),
          useValue: mockAduanRepository,
        },
      ],
    }).compile();

    service = module.get<AduanService>(AduanService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated aduan records', async () => {
      const mockAduans = [mockAduan, {
        ...mockAduan,
        id: 'aduan-2',
        judul: 'Aduan Keamanan',
        kategori: 'KEAMANAN',
      }];

      mockAduanRepository.findAndCount.mockResolvedValue([mockAduans, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockAduans,
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(mockAduanRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
        relations: ['user'],
      });
    });

    it('should filter by status', async () => {
      mockAduanRepository.findAndCount.mockResolvedValue([[mockAduan], 1]);

      const result = await service.findAll(1, 10, 'DIPROSES');

      expect(result.total).toBe(1);
      expect(mockAduanRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'DIPROSES' }),
        }),
      );
    });

    it('should filter by kategori', async () => {
      mockAduanRepository.findAndCount.mockResolvedValue([[mockAduan], 1]);

      const result = await service.findAll(1, 10, undefined, 'KEAMANAN');

      expect(result.total).toBe(1);
      expect(mockAduanRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ kategori: 'KEAMANAN' }),
        }),
      );
    });

    it('should respect pagination', async () => {
      mockAduanRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll(2, 20);

      expect(mockAduanRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return aduan if found', async () => {
      mockAduanRepository.findOne.mockResolvedValue(mockAduan);

      const result = await service.findOne('aduan-1');

      expect(result).toEqual(mockAduan);
      expect(mockAduanRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'aduan-1' },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if aduan not found', async () => {
      mockAduanRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('aduan-999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('aduan-999')).rejects.toThrow('Aduan not found');
    });
  });

  describe('create', () => {
    it('should create and return new aduan', async () => {
      const createAduanDto = {
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN' as const,
        lokasi: 'RT 01',
      };

      const newAduan = {
        ...mockAduan,
        ...createAduanDto,
        id: 'aduan-new',
        user: mockUser,
        userId: mockUser.id,
      };

      mockAduanRepository.create.mockReturnValue(newAduan);
      mockAduanRepository.save.mockResolvedValue(newAduan);

      const result = await service.create(createAduanDto, undefined, mockUser);

      expect(result).toEqual(newAduan);
      expect(mockAduanRepository.create).toHaveBeenCalledWith({
        ...createAduanDto,
        lampiran: null,
        user: mockUser,
        userId: mockUser.id,
      });
    });

    it('should create aduan with attachment', async () => {
      const createAduanDto = {
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN' as const,
      };

      const mockFile = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const newAduan = {
        ...mockAduan,
        ...createAduanDto,
        lampiran: 'photo.jpg',
      };

      mockAduanRepository.create.mockReturnValue(newAduan);
      mockAduanRepository.save.mockResolvedValue(newAduan);

      const result = await service.create(createAduanDto, mockFile, mockUser);

      expect(result.lampiran).toBe('photo.jpg');
    });

    it('should create aduan without user (guest)', async () => {
      const createAduanDto = {
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN' as const,
      };

      const newAduan = {
        ...mockAduan,
        ...createAduanDto,
        user: null,
        userId: null,
      };

      mockAduanRepository.create.mockReturnValue(newAduan);
      mockAduanRepository.save.mockResolvedValue(newAduan);

      const result = await service.create(createAduanDto, undefined, undefined);

      expect(result.userId).toBeNull();
    });
  });

  describe('update', () => {
    it('should update aduan if user is owner', async () => {
      const updateAduanDto = {
        judul: 'Aduan Kebersihan Updated',
        deskripsi: 'Lingkungan RT 01 sangat kotor',
      };

      const updatedAduan = {
        ...mockAduan,
        ...updateAduanDto,
      };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.merge.mockReturnValue(updatedAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.update('aduan-1', updateAduanDto, mockUser);

      expect(result).toEqual(updatedAduan);
    });

    it('should update aduan if user is SUPERADMIN', async () => {
      const updateAduanDto = { judul: 'Updated' };
      const updatedAduan = { ...mockAduan, ...updateAduanDto };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.merge.mockReturnValue(updatedAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.update('aduan-1', updateAduanDto, mockSuperAdminUser);

      expect(result).toEqual(updatedAduan);
    });

    it('should update aduan if user is SUPERVISOR', async () => {
      const updateAduanDto = { judul: 'Updated' };
      const updatedAduan = { ...mockAduan, ...updateAduanDto };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.merge.mockReturnValue(updatedAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.update('aduan-1', updateAduanDto, mockSupervisorUser);

      expect(result).toEqual(updatedAduan);
    });

    it('should update aduan if user is ADMIN', async () => {
      const updateAduanDto = { judul: 'Updated' };
      const updatedAduan = { ...mockAduan, ...updateAduanDto };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.merge.mockReturnValue(updatedAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.update('aduan-1', updateAduanDto, mockUser);

      expect(result).toEqual(updatedAduan);
    });

    it('should throw NotFoundException if aduan not found', async () => {
      mockAduanRepository.findOne.mockResolvedValue(null);

      await expect(service.update('aduan-999', {}, mockUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin', async () => {
      const otherAduan = { ...mockAduan, userId: 'other-user-id' };
      mockAduanRepository.findOne.mockResolvedValue(otherAduan);

      await expect(service.update('aduan-1', {}, mockWargaUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove aduan if user is owner', async () => {
      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.remove.mockResolvedValue(mockAduan);

      const result = await service.remove('aduan-1', mockUser);

      expect(result).toEqual(mockAduan);
    });

    it('should remove aduan if user is SUPERADMIN', async () => {
      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.remove.mockResolvedValue(mockAduan);

      const result = await service.remove('aduan-1', mockSuperAdminUser);

      expect(result).toEqual(mockAduan);
    });

    it('should remove aduan if user is SUPERVISOR', async () => {
      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.remove.mockResolvedValue(mockAduan);

      const result = await service.remove('aduan-1', mockSupervisorUser);

      expect(result).toEqual(mockAduan);
    });

    it('should throw NotFoundException if aduan not found', async () => {
      mockAduanRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('aduan-999', mockSuperAdminUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin/supervisor', async () => {
      const otherAduan = { ...mockAduan, userId: 'other-user-id' };
      mockAduanRepository.findOne.mockResolvedValue(otherAduan);

      await expect(service.remove('aduan-1', mockWargaUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUser', () => {
    it('should return aduan records for specific user', async () => {
      mockAduanRepository.find.mockResolvedValue([mockAduan]);

      const result = await service.findByUser('1');

      expect(result).toEqual([mockAduan]);
      expect(mockAduanRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
    });
  });

  describe('updateStatus', () => {
    it('should update aduan status if user is SUPERADMIN', async () => {
      const updatedAduan = { ...mockAduan, status: 'DIPROSES', catatan: 'Sedang diproses' };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.updateStatus('aduan-1', 'DIPROSES', mockSuperAdminUser, 'Sedang diproses');

      expect(result).toEqual(updatedAduan);
      expect(result.status).toBe('DIPROSES');
      expect(result.catatan).toBe('Sedang diproses');
    });

    it('should update aduan status if user is SUPERVISOR', async () => {
      const updatedAduan = { ...mockAduan, status: 'SELESAI' };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.updateStatus('aduan-1', 'SELESAI', mockSupervisorUser);

      expect(result.status).toBe('SELESAI');
    });

    it('should update aduan status if user is ADMIN', async () => {
      const updatedAduan = { ...mockAduan, status: 'DITOLAK', catatan: 'Tidak valid' };

      mockAduanRepository.findOne.mockResolvedValue(mockAduan);
      mockAduanRepository.save.mockResolvedValue(updatedAduan);

      const result = await service.updateStatus('aduan-1', 'DITOLAK', mockUser, 'Tidak valid');

      expect(result.status).toBe('DITOLAK');
    });

    it('should throw ForbiddenException if user is not admin/supervisor/superadmin', async () => {
      mockAduanRepository.findOne.mockResolvedValue(mockAduan);

      await expect(service.updateStatus('aduan-1', 'DIPROSES', mockWargaUser))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if aduan not found', async () => {
      mockAduanRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus('aduan-999', 'DIPROSES', mockSuperAdminUser))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return aduan statistics', async () => {
      const mockAduans = [
        { ...mockAduan, status: 'BARU' },
        { ...mockAduan, id: 'aduan-2', status: 'BARU' },
        { ...mockAduan, id: 'aduan-3', status: 'DIPROSES' },
        { ...mockAduan, id: 'aduan-4', status: 'SELESAI' },
        { ...mockAduan, id: 'aduan-5', status: 'DITOLAK' },
      ];

      mockAduanRepository.find.mockResolvedValue(mockAduans);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 5,
        baru: 2,
        diproses: 1,
        selesai: 1,
        ditolak: 1,
        byKategori: expect.any(Object),
      });
    });

    it('should count by kategori', async () => {
      const mockAduans = [
        { ...mockAduan, kategori: 'KEAMANAN' },
        { ...mockAduan, id: 'aduan-2', kategori: 'KEAMANAN' },
        { ...mockAduan, id: 'aduan-3', kategori: 'KEBERSIHAN' },
      ];

      mockAduanRepository.find.mockResolvedValue(mockAduans);

      const result = await service.getStats();

      expect(result.byKategori).toEqual({
        KEAMANAN: 2,
        KEBERSIHAN: 1,
      });
    });
  });

  describe('search', () => {
    it('should return aduan matching search query', async () => {
      mockAduanRepository.find.mockResolvedValue([mockAduan]);

      const result = await service.search('Kebersihan');

      expect(result).toEqual([mockAduan]);
      expect(mockAduanRepository.find).toHaveBeenCalledWith({
        where: [
          { judul: Like('%Kebersihan%') },
          { deskripsi: Like('%Kebersihan%') },
        ],
        order: { createdAt: 'DESC' },
        take: 10,
        relations: ['user'],
      });
    });
  });

  describe('findRecent', () => {
    it('should return recent aduan with default limit', async () => {
      mockAduanRepository.find.mockResolvedValue([mockAduan]);

      const result = await service.findRecent();

      expect(result).toEqual([mockAduan]);
      expect(mockAduanRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 10,
        relations: ['user'],
      });
    });

    it('should return recent aduan with custom limit', async () => {
      mockAduanRepository.find.mockResolvedValue([mockAduan]);

      const result = await service.findRecent(5);

      expect(mockAduanRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user'],
      });
    });
  });
});
