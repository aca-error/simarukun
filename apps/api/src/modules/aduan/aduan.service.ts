import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Aduan } from './entities/aduan.entity';
import { CreateAduanDto } from './dto/create-aduan.dto';
import { UpdateAduanDto } from './dto/update-aduan.dto';
import { User } from '../users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AduanStats {
  total: number;
  baru: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  byKategori: Record<string, number>;
}

@Injectable()
export class AduanService {
  constructor(
    @InjectRepository(Aduan)
    private aduanRepository: Repository<Aduan>,
  ) {}

  /**
   * Get all aduan records with pagination and optional filters
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    kategori?: string,
  ): Promise<PaginatedResult<Aduan>> {
    const where: FindOptionsWhere<Aduan> = {};

    if (status) {
      where.status = status as any;
    }

    if (kategori) {
      where.kategori = kategori as any;
    }

    const [aduans, total] = await this.aduanRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return {
      data: aduans,
      total,
      page,
      limit,
    };
  }

  /**
   * Get aduan by ID
   */
  async findOne(id: string): Promise<Aduan> {
    const aduan = await this.aduanRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!aduan) {
      throw new NotFoundException('Aduan not found');
    }

    return aduan;
  }

  /**
   * Create a new aduan
   */
  async create(
    createAduanDto: CreateAduanDto,
    file?: Express.Multer.File,
    user?: User,
  ): Promise<Aduan> {
    let lampiran: string | null = null;

    if (file) {
      // In production, you would upload the file to a storage service
      // For now, we'll just store the filename
      lampiran = file.originalname;
    }

    const aduan = this.aduanRepository.create({
      ...createAduanDto,
      lampiran,
      user,
      userId: user?.id || null,
    });

    return this.aduanRepository.save(aduan);
  }

  /**
   * Update an aduan
   */
  async update(
    id: string,
    updateAduanDto: UpdateAduanDto,
    currentUser: User,
  ): Promise<Aduan> {
    const aduan = await this.findOne(id);

    // Check if user has permission to update this aduan
    if (aduan.userId !== currentUser.id && currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SUPERVISOR' && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to update this aduan');
    }

    const updatedAduan = this.aduanRepository.merge(aduan, updateAduanDto);

    return this.aduanRepository.save(updatedAduan);
  }

  /**
   * Delete an aduan
   */
  async remove(id: string, currentUser: User): Promise<Aduan> {
    const aduan = await this.findOne(id);

    // Check if user has permission to delete this aduan
    if (aduan.userId !== currentUser.id && currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SUPERVISOR') {
      throw new ForbiddenException('You do not have permission to delete this aduan');
    }

    return this.aduanRepository.remove(aduan);
  }

  /**
   * Get aduan by user
   */
  async findByUser(userId: string): Promise<Aduan[]> {
    return this.aduanRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Update aduan status
   */
  async updateStatus(
    id: string,
    status: string,
    currentUser: User,
    catatan?: string,
  ): Promise<Aduan> {
    const aduan = await this.findOne(id);

    // Check if user has permission to update this aduan status
    if (currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SUPERVISOR' && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to update aduan status');
    }

    aduan.status = status as any;

    if (catatan) {
      aduan.catatan = catatan;
    }

    return this.aduanRepository.save(aduan);
  }

  /**
   * Get aduan statistics
   */
  async getStats(): Promise<AduanStats> {
    const aduans = await this.aduanRepository.find();

    const total = aduans.length;
    const baru = aduans.filter((a) => a.status === 'BARU').length;
    const diproses = aduans.filter((a) => a.status === 'DIPROSES').length;
    const selesai = aduans.filter((a) => a.status === 'SELESAI').length;
    const ditolak = aduans.filter((a) => a.status === 'DITOLAK').length;

    // Count by category
    const byKategori: Record<string, number> = {};
    aduans.forEach((aduan) => {
      byKategori[aduan.kategori] = (byKategori[aduan.kategori] || 0) + 1;
    });

    return {
      total,
      baru,
      diproses,
      selesai,
      ditolak,
      byKategori,
    };
  }

  /**
   * Search aduan by title or description
   */
  async search(query: string): Promise<Aduan[]> {
    return this.aduanRepository.find({
      where: [
        { judul: Like(`%${query}%`) },
        { deskripsi: Like(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['user'],
    });
  }

  /**
   * Get recent aduan
   */
  async findRecent(limit: number = 10): Promise<Aduan[]> {
    return this.aduanRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }
}
