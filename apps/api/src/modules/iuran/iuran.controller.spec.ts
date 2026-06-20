/**
 * Unit Tests for IuranController
 * 
 * @package SimaRukun
 * @subpackage Backend/Iuran
 */

import { Test, TestingModule } from '@nestjs/testing';
import { IuranController } from './iuran.controller';
import { IuranService } from './iuran.service';
import { CreateIuranDto } from './dto/create-iuran.dto';
import { UpdateIuranDto } from './dto/update-iuran.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// Mock IuranService
const mockIuranService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByUser: jest.fn(),
  getReport: jest.fn(),
  updateStatus: jest.fn(),
};

// Mock Request object
const mockRequest = {
  user: {
    sub: '1',
    email: 'test@example.com',
    role: UserRole.SUPERADMIN,
  },
};

describe('IuranController', () => {
  let controller: IuranController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IuranController],
      providers: [
        {
          provide: IuranService,
          useValue: mockIuranService,
        },
      ],
    }).compile();

    controller = module.get<IuranController>(IuranController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated iuran records', async () => {
      const mockIurans = [
        {
          id: '1',
          judul: 'Iuran Bulanan',
          jumlah: 100000,
          tanggalJatuhTempo: new Date(),
          status: 'BELUM_BAYAR',
        },
      ];

      mockIuranService.findAll.mockResolvedValue({
        data: mockIurans,
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.findAll(mockRequest as any, 1, 10, 'BELUM_BAYAR', 2026, 6);

      expect(result).toEqual({
        data: mockIurans,
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockIuranService.findAll).toHaveBeenCalledWith(1, 10, 'BELUM_BAYAR', 2026, 6);
    });
  });

  describe('findOne', () => {
    it('should return iuran by ID', async () => {
      const mockIuran = {
        id: '1',
        judul: 'Iuran Bulanan',
        jumlah: 100000,
        tanggalJatuhTempo: new Date(),
        status: 'BELUM_BAYAR',
      };

      mockIuranService.findOne.mockResolvedValue(mockIuran);

      const result = await controller.findOne('1', mockRequest as any);

      expect(result).toEqual(mockIuran);
      expect(mockIuranService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new iuran', async () => {
      const createIuranDto: CreateIuranDto = {
        judul: 'Iuran Bulanan',
        deskripsi: 'Iuran bulanan RT 01',
        jumlah: 100000,
        tanggalJatuhTempo: '2026-07-01',
        status: 'BELUM_BAYAR',
      };

      const mockIuran = {
        id: '1',
        ...createIuranDto,
        userId: '1',
        tanggalJatuhTempo: new Date('2026-07-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockIuranService.create.mockResolvedValue(mockIuran);

      const result = await controller.create(createIuranDto, mockRequest as any);

      expect(result).toEqual(mockIuran);
      expect(mockIuranService.create).toHaveBeenCalledWith(createIuranDto, mockRequest.user);
    });
  });

  describe('update', () => {
    it('should update an iuran', async () => {
      const updateIuranDto: UpdateIuranDto = {
        judul: 'Iuran Bulanan Updated',
        jumlah: 150000,
      };

      const mockIuran = {
        id: '1',
        judul: 'Iuran Bulanan Updated',
        jumlah: 150000,
        tanggalJatuhTempo: new Date(),
        status: 'BELUM_BAYAR',
      };

      mockIuranService.update.mockResolvedValue(mockIuran);

      const result = await controller.update('1', updateIuranDto, mockRequest as any);

      expect(result).toEqual(mockIuran);
      expect(mockIuranService.update).toHaveBeenCalledWith('1', updateIuranDto, mockRequest.user);
    });
  });

  describe('remove', () => {
    it('should delete an iuran', async () => {
      const mockIuran = {
        id: '1',
        judul: 'Iuran Bulanan',
        jumlah: 100000,
        tanggalJatuhTempo: new Date(),
        status: 'BELUM_BAYAR',
      };

      mockIuranService.remove.mockResolvedValue(mockIuran);

      const result = await controller.remove('1', mockRequest as any);

      expect(result).toEqual(mockIuran);
      expect(mockIuranService.remove).toHaveBeenCalledWith('1', mockRequest.user);
    });
  });

  describe('findByUser', () => {
    it('should return iuran by user', async () => {
      const mockIurans = [
        {
          id: '1',
          judul: 'Iuran Bulanan',
          jumlah: 100000,
          tanggalJatuhTempo: new Date(),
          status: 'BELUM_BAYAR',
        },
      ];

      mockIuranService.findByUser.mockResolvedValue(mockIurans);

      const result = await controller.findByUser('1', mockRequest as any);

      expect(result).toEqual(mockIurans);
      expect(mockIuranService.findByUser).toHaveBeenCalledWith('1');
    });
  });

  describe('getReport', () => {
    it('should return iuran report', async () => {
      const mockReport = {
        totalIuran: 10,
        totalDibayar: 5,
        totalBelumDibayar: 3,
        totalTelat: 2,
        totalJumlah: 1000000,
        totalJumlahDibayar: 500000,
        totalJumlahBelumDibayar: 500000,
      };

      mockIuranService.getReport.mockResolvedValue(mockReport);

      const result = await controller.getReport(2026, 6, mockRequest as any);

      expect(result).toEqual(mockReport);
      expect(mockIuranService.getReport).toHaveBeenCalledWith(2026, 6);
    });
  });
});
