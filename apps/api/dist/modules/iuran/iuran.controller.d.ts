import { AuthRequest } from '../../common/types';
import { IuranService } from './iuran.service';
import { CreateIuranDto } from './dto/create-iuran.dto';
import { UpdateIuranDto } from './dto/update-iuran.dto';
export declare class IuranController {
    private readonly iuranService;
    constructor(iuranService: IuranService);
    findAll(req: AuthRequest, page?: number, limit?: number, status?: string, tahun?: number, bulan?: number): Promise<import("../../common/types").PaginatedResult<import("./entities/iuran.entity").Iuran>>;
    getReport(tahun?: number, bulan?: number, req?: AuthRequest): Promise<import("./iuran.service").IuranReport>;
    findByUser(userId: string, req: AuthRequest): Promise<import("./entities/iuran.entity").Iuran[]>;
    findOne(id: string, req: AuthRequest): Promise<import("./entities/iuran.entity").Iuran>;
    create(createIuranDto: CreateIuranDto, req: AuthRequest): Promise<import("./entities/iuran.entity").Iuran>;
    update(id: string, updateIuranDto: UpdateIuranDto, req: AuthRequest): Promise<import("./entities/iuran.entity").Iuran>;
    remove(id: string, req: AuthRequest): Promise<import("./entities/iuran.entity").Iuran>;
}
