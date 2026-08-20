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
exports.AduanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aduan_entity_1 = require("./entities/aduan.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let AduanService = class AduanService {
    constructor(aduanRepository) {
        this.aduanRepository = aduanRepository;
    }
    async findAll(page = 1, limit = 10, status, kategori) {
        const where = {};
        const relations = { user: true };
        if (status) {
            where.status = status;
        }
        if (kategori) {
            where.kategori = kategori;
        }
        const [aduans, total] = await this.aduanRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations,
        });
        return {
            data: aduans,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const aduan = await this.aduanRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!aduan) {
            throw new common_1.NotFoundException('Aduan not found');
        }
        return aduan;
    }
    async create(createAduanDto, file, user) {
        let lampiran = null;
        if (file) {
            lampiran = file.filename || file.originalname;
        }
        const aduan = this.aduanRepository.create({
            ...createAduanDto,
            lampiran,
            user,
            userId: user?.id || null,
        });
        return this.aduanRepository.save(aduan);
    }
    async update(id, updateAduanDto, currentUser) {
        const aduan = await this.findOne(id);
        if (aduan.userId !== currentUser.id &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERVISOR &&
            currentUser.role !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to update this aduan');
        }
        const updatedAduan = this.aduanRepository.merge(aduan, updateAduanDto);
        return this.aduanRepository.save(updatedAduan);
    }
    async remove(id, currentUser) {
        const aduan = await this.findOne(id);
        if (aduan.userId !== currentUser.id &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERVISOR) {
            throw new common_1.ForbiddenException('You do not have permission to delete this aduan');
        }
        return this.aduanRepository.remove(aduan);
    }
    async findByUser(userId) {
        return this.aduanRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            relations: { user: true },
        });
    }
    async updateStatus(id, status, currentUser, catatan) {
        const aduan = await this.findOne(id);
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN &&
            currentUser.role !== user_role_enum_1.UserRole.SUPERVISOR &&
            currentUser.role !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to update aduan status');
        }
        aduan.status = status;
        if (catatan) {
            aduan.catatan = catatan;
        }
        return this.aduanRepository.save(aduan);
    }
    async getStats() {
        const aduans = await this.aduanRepository.find();
        const total = aduans.length;
        const baru = aduans.filter((a) => a.status === 'BARU').length;
        const diproses = aduans.filter((a) => a.status === 'DIPROSES').length;
        const selesai = aduans.filter((a) => a.status === 'SELESAI').length;
        const ditolak = aduans.filter((a) => a.status === 'DITOLAK').length;
        const byKategori = {};
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
    async search(query) {
        return this.aduanRepository.find({
            where: [
                { judul: (0, typeorm_2.Like)(`%${query}%`) },
                { deskripsi: (0, typeorm_2.Like)(`%${query}%`) },
            ],
            order: { createdAt: 'DESC' },
            take: 10,
            relations: { user: true },
        });
    }
    async findRecent(limit = 10) {
        return this.aduanRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
            relations: { user: true },
        });
    }
};
exports.AduanService = AduanService;
exports.AduanService = AduanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(aduan_entity_1.Aduan)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AduanService);
//# sourceMappingURL=aduan.service.js.map