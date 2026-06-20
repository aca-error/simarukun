import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, MoreThan, LessThan, Between } from 'typeorm';
import { Iuran } from './entities/iuran.entity';
import { CreateIuranDto } from './dto/create-iuran.dto';
import { UpdateIuranDto } from './dto/update-iuran.dto';
import { User } from '../users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IuranReport {
  totalIuran: number;
  totalDibayar: number;
  totalBelumDibayar: number;
  totalTelat: number;
  totalJumlah: number;
  totalJumlahDibayar: number;
  totalJumlahBelumDibayar: number;
}

@Injectable()
export class IuranService {
  constructor(
    @InjectRepository(Iuran)
    private iuranRepository: Repository<Iuran>,
  ) {}

  /**
   * Get all iuran records with pagination and optional filters
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    tahun?: number,
    bulan?: number,
  ): Promise<PaginatedResult<Iuran>> {
    const where: FindOptionsWhere<Iuran> = {};

    if (status) {
      where.status = status as any;
    }

    if (tahun && bulan) {
      const startDate = new Date(tahun, bulan - 1, 1);
      const endDate = new Date(tahun, bulan, 0);
      where.tanggalJatuhTempo = Between(startDate, endDate);
    } else if (tahun) {
      const startDate = new Date(tahun, 0, 1);
      const endDate = new Date(tahun, 11, 31);
      where.tanggalJatuhTempo = Between(startDate, endDate);
    }

    const [iurans, total] = await this.iuranRepository.findAndCount({
      where,
      order: { tanggalJatuhTempo: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return {
      data: iurans,
      total,
      page,
      limit,
    };
  }

  /**
   * Get iuran by ID
   */
  async findOne(id: string): Promise<Iuran> {
    const iuran = await this.iuranRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!iuran) {
      throw new NotFoundException('Iuran not found');
    }

    return iuran;
  }

  /**
   * Create a new iuran record
   */
  async create(createIuranDto: CreateIuranDto, user: User): Promise<Iuran> {
    const iuran = this.iuranRepository.create({
      ...createIuranDto,
      user,
      userId: user.id,
      tanggalJatuhTempo: new Date(createIuranDto.tanggalJatuhTempo),
    });

    return this.iuranRepository.save(iuran);
  }

  /**
   * Update an iuran record
   */
  async update(
    id: string,
    updateIuranDto: UpdateIuranDto,
    currentUser: User,
  ): Promise<Iuran> {
    const iuran = await this.findOne(id);

    // Check if user has permission to update this iuran
    if (iuran.userId !== currentUser.id && currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SUPERVISOR') {
      throw new ForbiddenException('You do not have permission to update this iuran');
    }

    const updatedIuran = this.iuranRepository.merge(iuran, updateIuranDto);

    if (updateIuranDto.tanggalJatuhTempo) {
      updatedIuran.tanggalJatuhTempo = new Date(updateIuranDto.tanggalJatuhTempo);
    }

    return this.iuranRepository.save(updatedIuran);
  }

  /**
   * Delete an iuran record
   */
  async remove(id: string, currentUser: User): Promise<Iuran> {
    const iuran = await this.findOne(id);

    // Check if user has permission to delete this iuran
    if (iuran.userId !== currentUser.id && currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SUPERVISOR') {
      throw new ForbiddenException('You do not have permission to delete this iuran');
    }

    return this.iuranRepository.remove(iuran);
  }

  /**
   * Get iuran by user
   */
  async findByUser(userId: string): Promise<Iuran[]> {
    return this.iuranRepository.find({
      where: { userId },
      order: { tanggalJatuhTempo: 'DESC', createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Get iuran report
   */
  async getReport(tahun?: number, bulan?: number): Promise<IuranReport> {
    const where: FindOptionsWhere<Iuran> = {};

    if (tahun && bulan) {
      const startDate = new Date(tahun, bulan - 1, 1);
      const endDate = new Date(tahun, bulan, 0);
      where.tanggalJatuhTempo = Between(startDate, endDate);
    } else if (tahun) {
      const startDate = new Date(tahun, 0, 1);
      const endDate = new Date(tahun, 11, 31);
      where.tanggalJatuhTempo = Between(startDate, endDate);
    }

    const iurans = await this.iuranRepository.find({ where });

    const totalIuran = iurans.length;
    const totalDibayar = iurans.filter((i) => i.status === 'SUDAH_BAYAR').length;
    const totalBelumDibayar = iurans.filter((i) => i.status === 'BELUM_BAYAR').length;
    const totalTelat = iurans.filter((i) => i.status === 'TELAT').length;
    const totalJumlah = iurans.reduce((sum, i) => sum + i.jumlah, 0);
    const totalJumlahDibayar = iurans
      .filter((i) => i.status === 'SUDAH_BAYAR')
      .reduce((sum, i) => sum + i.jumlah, 0);
    const totalJumlahBelumDibayar = iurans
      .filter((i) => i.status === 'BELUM_BAYAR' || i.status === 'TELAT')
      .reduce((sum, i) => sum + i.jumlah, 0);

    return {
      totalIuran,
      totalDibayar,
      totalBelumDibayar,
      totalTelat,
      totalJumlah,
      totalJumlahDibayar,
      totalJumlahBelumDibayar,
    };
  }

  /**
   * Update iuran status
   */
  async updateStatus(
    id: string,
    status: string,
    currentUser: User,
    tanggalPembayaran?: Date,
    buktiPembayaran?: string,
  ): Promise<Iuran> {
    const iuran = await this.findOne(id);

    // Check if user has permission to update this iuran
    if (iuran.userId !== currentUser.id && currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SUPERVISOR') {
      throw new ForbiddenException('You do not have permission to update this iuran');
    }

    iuran.status = status as any;

    if (tanggalPembayaran) {
      iuran.tanggalPembayaran = tanggalPembayaran;
    }

    if (buktiPembayaran) {
      iuran.buktiPembayaran = buktiPembayaran;
    }

    // If status is SUDAH_BAYAR, set tanggalPembayaran to current date if not provided
    if (status === 'SUDAH_BAYAR' && !iuran.tanggalPembayaran) {
      iuran.tanggalPembayaran = new Date();
    }

    return this.iuranRepository.save(iuran);
  }

  /**
   * Get overdue iuran records
   */
  async findOverdue(): Promise<Iuran[]> {
    const today = new Date();

    return this.iuranRepository.find({
      where: {
        tanggalJatuhTempo: LessThan(today),
        status: 'BELUM_BAYAR',
      },
      order: { tanggalJatuhTempo: 'ASC' },
      relations: ['user'],
    });
  }

  /**
   * Get iuran by date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Iuran[]> {
    return this.iuranRepository.find({
      where: {
        tanggalJatuhTempo: Between(startDate, endDate),
      },
      order: { tanggalJatuhTempo: 'ASC' },
      relations: ['user'],
    });
  }
}
