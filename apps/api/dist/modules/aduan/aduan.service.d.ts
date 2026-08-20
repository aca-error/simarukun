import { Repository } from 'typeorm';
import { Aduan } from './entities/aduan.entity';
import { CreateAduanDto } from './dto/create-aduan.dto';
import { UpdateAduanDto } from './dto/update-aduan.dto';
import { User } from '../users/entities/user.entity';
import { PaginatedResult, BaseStats } from '../../common/types';
export interface AduanStats extends BaseStats {
    baru: number;
    diproses: number;
    selesai: number;
    ditolak: number;
    byKategori: Record<string, number>;
}
export declare class AduanService {
    private aduanRepository;
    constructor(aduanRepository: Repository<Aduan>);
    findAll(page?: number, limit?: number, status?: string, kategori?: string): Promise<PaginatedResult<Aduan>>;
    findOne(id: string): Promise<Aduan>;
    create(createAduanDto: CreateAduanDto, file?: Express.Multer.File, user?: User): Promise<Aduan>;
    update(id: string, updateAduanDto: UpdateAduanDto, currentUser: User): Promise<Aduan>;
    remove(id: string, currentUser: User): Promise<Aduan>;
    findByUser(userId: string): Promise<Aduan[]>;
    updateStatus(id: string, status: string, currentUser: User, catatan?: string): Promise<Aduan>;
    getStats(): Promise<AduanStats>;
    search(query: string): Promise<Aduan[]>;
    findRecent(limit?: number): Promise<Aduan[]>;
}
