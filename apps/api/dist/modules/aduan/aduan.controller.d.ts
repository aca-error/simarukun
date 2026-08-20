import { AduanService } from './aduan.service';
import { CreateAduanDto } from './dto/create-aduan.dto';
import { UpdateAduanDto } from './dto/update-aduan.dto';
import { AuthRequest } from '../../common/types';
export declare class AduanController {
    private readonly aduanService;
    constructor(aduanService: AduanService);
    findAll(req: AuthRequest, page?: number, limit?: number, status?: string, kategori?: string): Promise<import("../../common/types").PaginatedResult<import("./entities/aduan.entity").Aduan>>;
    getStats(req: AuthRequest): Promise<import("./aduan.service").AduanStats>;
    findByUser(userId: string, req: AuthRequest): Promise<import("./entities/aduan.entity").Aduan[]>;
    findOne(id: string, req: AuthRequest): Promise<import("./entities/aduan.entity").Aduan>;
    create(createAduanDto: CreateAduanDto, req: AuthRequest, file?: Express.Multer.File): Promise<import("./entities/aduan.entity").Aduan>;
    updateStatus(id: string, status: string, req: AuthRequest): Promise<import("./entities/aduan.entity").Aduan>;
    update(id: string, updateAduanDto: UpdateAduanDto, req: AuthRequest): Promise<import("./entities/aduan.entity").Aduan>;
    remove(id: string, req: AuthRequest): Promise<import("./entities/aduan.entity").Aduan>;
}
