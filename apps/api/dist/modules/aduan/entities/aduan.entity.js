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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aduan = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Aduan = class Aduan {
};
exports.Aduan = Aduan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Aduan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Aduan.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Aduan.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['KEAMANAN', 'KEBERSIHAN', 'FASILITAS', 'LAINNYA'],
        default: 'LAINNYA',
    }),
    __metadata("design:type", String)
], Aduan.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", Object)
], Aduan.prototype, "lampiran", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['BARU', 'DIPROSES', 'SELESAI', 'DITOLAK'],
        default: 'BARU',
    }),
    __metadata("design:type", String)
], Aduan.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", Object)
], Aduan.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", Object)
], Aduan.prototype, "lokasi", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.aduans, { onDelete: 'SET NULL' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], Aduan.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Aduan.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Aduan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Aduan.prototype, "updatedAt", void 0);
exports.Aduan = Aduan = __decorate([
    (0, typeorm_1.Index)(['user', 'status']),
    (0, typeorm_1.Index)(['kategori']),
    (0, typeorm_1.Index)(['createdAt']),
    (0, typeorm_1.Entity)({ name: 'aduan' })
], Aduan);
//# sourceMappingURL=aduan.entity.js.map