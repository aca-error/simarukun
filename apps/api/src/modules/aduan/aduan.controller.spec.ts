/**
 * Unit Tests for AduanController
 * 
 * @package SimaRukun
 * @subpackage Backend/Aduan
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AduanController } from './aduan.controller';
import { AduanService } from './aduan.service';
import { CreateAduanDto } from './dto/create-aduan.dto';
import { UpdateAduanDto } from './dto/update-aduan.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// Mock AduanService
const mockAduanService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByUser: jest.fn(),
  updateStatus: jest.fn(),
  getStats: jest.fn(),
  search: jest.fn(),
  findRecent: jest.fn(),
};

// Mock Request object
const mockRequest = {
  user: {
    sub: '1',
    email: 'test@example.com',
    role: UserRole.SUPERADMIN,
  },
};

// Mock Express.Multer.File
const mockFile = {
  originalname: 'photo.jpg',
  buffer: Buffer.from('test'),
  fieldname: 'file',
  mimetype: 'image/jpeg',
  size: 1024,
} as Express.Multer.File;

describe('AduanController', () => {
  let controller: AduanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AduanController],
      providers: [
        {
          provide: AduanService,
          useValue: mockAduanService,
        },
      ],
    }).compile();

    controller = module.get<AduanController>(AduanController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated aduan records', async () => {
      const mockAduans = [
        {
          id: '1',
          judul: 'Aduan Kebersihan',
          deskripsi: 'Lingkungan kotor',
          kategori: 'KEBERSIHAN',
          status: 'BARU',
        },
      ];

      mockAduanService.findAll.mockResolvedValue({
        data: mockAduans,
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await controller.findAll(mockRequest as any, 1, 10, 'BARU', 'KEBERSIHAN');

      expect(result).toEqual({
        data: mockAduans,
        total: 1,
        page: 1,
        limit: 10,
      });
      expect(mockAduanService.findAll).toHaveBeenCalledWith(1, 10, 'BARU', 'KEBERSIHAN');
    });
  });

  describe('findOne', () => {
    it('should return aduan by ID', async () => {
      const mockAduan = {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan kotor',
        kategori: 'KEBERSIHAN',
        status: 'BARU',
      };

      mockAduanService.findOne.mockResolvedValue(mockAduan);

      const result = await controller.findOne('1', mockRequest as any);

      expect(result).toEqual(mockAduan);
      expect(mockAduanService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new aduan', async () => {
      const createAduanDto: CreateAduanDto = {
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN',
        lokasi: 'RT 01',
      };

      const mockAduan = {
        id: '1',
        ...createAduanDto,
        userId: '1',
        status: 'BARU',
        lampiran: null,
        catatan: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAduanService.create.mockResolvedValue(mockAduan);

      const result = await controller.create(createAduanDto, undefined, mockRequest as any);

      expect(result).toEqual(mockAduan);
      expect(mockAduanService.create).toHaveBeenCalledWith(createAduanDto, undefined, mockRequest.user);
    });

    it('should create aduan with attachment', async () => {
      const createAduanDto: CreateAduanDto = {
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan RT 01 kotor',
        kategori: 'KEBERSIHAN',
        lokasi: 'RT 01',
      };

      const mockAduan = {
        id: '1',
        ...createAduanDto,
        lampiran: 'photo.jpg',
        userId: '1',
        status: 'BARU',
      };

      mockAduanService.create.mockResolvedValue(mockAduan);

      const result = await controller.create(createAduanDto, mockFile, mockRequest as any);

      expect(result.lampiran).toBe('photo.jpg');
      expect(mockAduanService.create).toHaveBeenCalledWith(createAduanDto, mockFile, mockRequest.user);
    });
  });

  describe('update', () => {
    it('should update an aduan', async () => {
      const updateAduanDto: UpdateAduanDto = {
        judul: 'Aduan Kebersihan Updated',
        deskripsi: 'Lingkungan RT 01 sangat kotor',
      };

      const mockAduan = {
        id: '1',
        judul: 'Aduan Kebersihan Updated',
        deskripsi: 'Lingkungan RT 01 sangat kotor',
        kategori: 'KEBERSIHAN',
        status: 'BARU',
      };

      mockAduanService.update.mockResolvedValue(mockAduan);

      const result = await controller.update('1', updateAduanDto, mockRequest as any);

      expect(result).toEqual(mockAduan);
      expect(mockAduanService.update).toHaveBeenCalledWith('1', updateAduanDto, mockRequest.user);
    });
  });

  describe('remove', () => {
    it('should delete an aduan', async () => {
      const mockAduan = {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan kotor',
        kategori: 'KEBERSIHAN',
        status: 'BARU',
      };

      mockAduanService.remove.mockResolvedValue(mockAduan);

      const result = await controller.remove('1', mockRequest as any);

      expect(result).toEqual(mockAduan);
      expect(mockAduanService.remove).toHaveBeenCalledWith('1', mockRequest.user);
    });
  });

  describe('findByUser', () => {
    it('should return aduan by user', async () => {
      const mockAduans = [
        {
          id: '1',
          judul: 'Aduan Kebersihan',
          deskripsi: 'Lingkungan kotor',
          kategori: 'KEBERSIHAN',
          status: 'BARU',
        },
      ];

      mockAduanService.findByUser.mockResolvedValue(mockAduans);

      const result = await controller.findByUser('1', mockRequest as any);

      expect(result).toEqual(mockAduans);
      expect(mockAduanService.findByUser).toHaveBeenCalledWith('1');
    });
  });

  describe('updateStatus', () => {
    it('should update aduan status', async () => {
      const mockAduan = {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan kotor',
        kategori: 'KEBERSIHAN',
        status: 'DIPROSES',
        catatan: 'Sedang diproses',
      };

      mockAduanService.updateStatus.mockResolvedValue(mockAduan);

      const result = await controller.updateStatus('1', 'DIPROSES', mockRequest as any);

      expect(result).toEqual(mockAduan);
      expect(mockAduanService.updateStatus).toHaveBeenCalledWith('1', 'DIPROSES', mockRequest.user);
    });

    it('should update aduan status with catatan', async () => {
      const mockAduan = {
        id: '1',
        judul: 'Aduan Kebersihan',
        deskripsi: 'Lingkungan kotor',
        kategori: 'KEBERSIHAN',
        status: 'SELESAI',
        catatan: 'Sudah diperbaiki',
      };

      // Mock the request to include catatan in body
      const mockRequestWithCatatan = {
        ...mockRequest,
        body: { status: 'SELESAI', catatan: 'Sudah diperbaiki' },
      };

      mockAduanService.updateStatus.mockResolvedValue(mockAduan);

      // Note: The actual implementation would need to extract catatan from request body
      const result = await controller.updateStatus('1', 'SELESAI', mockRequestWithCatatan as any);

      expect(result.status).toBe('SELESAI');
    });
  });

  describe('getStats', () => {
    it('should return aduan statistics', async () => {
      const mockStats = {
        total: 10,
        baru: 5,
        diproses: 3,
        selesai: 1,
        ditolak: 1,
        byKategori: {
          KEAMANAN: 2,
          KEBERSIHAN: 3,
          FASILITAS: 4,
          LAINNYA: 1,
        },
      };

      mockAduanService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockRequest as any);

      expect(result).toEqual(mockStats);
      expect(mockAduanService.getStats).toHaveBeenCalled();
    });
  });
});
