"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IuranService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const iuran_entity_1 = require("./entities/iuran.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let IuranService = class IuranService {
    constructor(iuranRepository) {
        this.iuranRepository = iuranRepository;
    }
    async findAll(page = 1, limit = 10, status, tahun, bulan) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (tahun && bulan) {
            const startDate = new Date(tahun, bulan - 1, 1);
            const endDate = new Date(tahun, bulan, 0);
            where.tanggalJatuhTempo = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (tahun) {
            const startDate = new Date(tahun, 0, 1);
            const endDate = new Date(tahun, 11, 31);
            where.tanggalJatuhTempo = (0, typeorm_2.Between)(startDate, endDate);
        }
        const [iurans, total] = await this.iuranRepository.findAndCount({
            where,
            order: { tanggalJatuhTempo: 'DESC', createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: { user: true },
        });
        return {
            data: iurans,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const iuran = await this.iuranRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!iuran) {
            throw new common_1.NotFoundException('Iuran not found');
        }
        return iuran;
    }
    async create(createIuranDto, user) {
        const iuran = this.iuranRepository.create({
            ...createIuranDto,
            userId: user.id,
            tanggalJatuhTempo: new Date(createIuranDto.tanggalJatuhTempo),
        });
        return this.iuranRepository.save(iuran);
    }
    async update(id, updateIuranDto, currentUser) {
        const iuran = await this.findOne(id);
        if (iuran.userId !== currentUser.id &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERVISOR) {
            throw new common_1.ForbiddenException('You do not have permission to update this iuran');
        }
        const updatedIuran = this.iuranRepository.merge(iuran, updateIuranDto);
        if (updateIuranDto.tanggalJatuhTempo) {
            updatedIuran.tanggalJatuhTempo = new Date(updateIuranDto.tanggalJatuhTempo);
        }
        return this.iuranRepository.save(updatedIuran);
    }
    async remove(id, currentUser) {
        const iuran = await this.findOne(id);
        if (iuran.userId !== currentUser.id &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERVISOR) {
            throw new common_1.ForbiddenException('You do not have permission to delete this iuran');
        }
        return this.iuranRepository.remove(iuran);
    }
    async findByUser(userId) {
        return this.iuranRepository.find({
            where: { userId },
            order: { tanggalJatuhTempo: 'DESC', createdAt: 'DESC' },
            relations: { user: true },
        });
    }
    async getReport(tahun, bulan) {
        const where = {};
        if (tahun && bulan) {
            const startDate = new Date(tahun, bulan - 1, 1);
            const endDate = new Date(tahun, bulan, 0);
            where.tanggalJatuhTempo = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (tahun) {
            const startDate = new Date(tahun, 0, 1);
            const endDate = new Date(tahun, 11, 31);
            where.tanggalJatuhTempo = (0, typeorm_2.Between)(startDate, endDate);
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
            total: totalIuran,
        };
    }
    async updateStatus(id, status, currentUser, tanggalPembayaran, buktiPembayaran) {
        const iuran = await this.findOne(id);
        if (iuran.userId !== currentUser.id &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERVISOR) {
            throw new common_1.ForbiddenException('You do not have permission to update this iuran');
        }
        iuran.status = status;
        if (tanggalPembayaran) {
            iuran.tanggalPembayaran = tanggalPembayaran;
        }
        if (buktiPembayaran) {
            iuran.buktiPembayaran = buktiPembayaran;
        }
        if (status === 'SUDAH_BAYAR' && !iuran.tanggalPembayaran) {
            iuran.tanggalPembayaran = new Date();
        }
        return this.iuranRepository.save(iuran);
    }
    async findOverdue() {
        const today = new Date();
        return this.iuranRepository.find({
            where: {
                tanggalJatuhTempo: (0, typeorm_2.LessThan)(today),
                status: 'BELUM_BAYAR',
            },
            order: { tanggalJatuhTempo: 'ASC' },
            relations: { user: true },
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.iuranRepository.find({
            where: {
                tanggalJatuhTempo: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { tanggalJatuhTempo: 'ASC' },
            relations: { user: true },
        });
    }
};
exports.IuranService = IuranService;
exports.IuranService = IuranService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(iuran_entity_1.Iuran)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IuranService);
//# sourceMappingURL=iuran.service.js.map