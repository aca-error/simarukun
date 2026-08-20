import { Repository } from 'typeorm';
import { Iuran } from './entities/iuran.entity';
import { CreateIuranDto } from './dto/create-iuran.dto';
import { UpdateIuranDto } from './dto/update-iuran.dto';
import { User } from '../users/entities/user.entity';
import { PaginatedResult, BaseStats, UserContext } from '../../common/types';
export interface IuranReport extends BaseStats {
    totalIuran: number;
    totalDibayar: number;
    totalBelumDibayar: number;
    totalTelat: number;
    totalJumlah: number;
    totalJumlahDibayar: number;
    totalJumlahBelumDibayar: number;
}
export declare class IuranService {
    private iuranRepository;
    constructor(iuranRepository: Repository<Iuran>);
    findAll(page?: number, limit?: number, status?: string, tahun?: number, bulan?: number): Promise<PaginatedResult<Iuran>>;
    findOne(id: string): Promise<Iuran>;
    create(createIuranDto: CreateIuranDto, user: UserContext): Promise<Iuran>;
    update(id: string, updateIuranDto: UpdateIuranDto, currentUser: UserContext): Promise<Iuran>;
    remove(id: string, currentUser: UserContext): Promise<Iuran>;
    findByUser(userId: string): Promise<Iuran[]>;
    getReport(tahun?: number, bulan?: number): Promise<IuranReport>;
    updateStatus(id: string, status: string, currentUser: User, tanggalPembayaran?: Date, buktiPembayaran?: string): Promise<Iuran>;
    findOverdue(): Promise<Iuran[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Iuran[]>;
}
