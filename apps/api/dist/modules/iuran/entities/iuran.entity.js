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
exports.Iuran = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Iuran = class Iuran {
};
exports.Iuran = Iuran;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Iuran.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Iuran.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 2000, nullable: true }),
    __metadata("design:type", Object)
], Iuran.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)('integer'),
    __metadata("design:type", Number)
], Iuran.prototype, "jumlah", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Iuran.prototype, "tanggalJatuhTempo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['BELUM_BAYAR', 'SUDAH_BAYAR', 'TELAT'],
        default: 'BELUM_BAYAR',
    }),
    __metadata("design:type", String)
], Iuran.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Iuran.prototype, "tanggalPembayaran", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", Object)
], Iuran.prototype, "buktiPembayaran", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", Object)
], Iuran.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.iurans, { onDelete: 'SET NULL' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], Iuran.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Iuran.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Iuran.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Iuran.prototype, "updatedAt", void 0);
exports.Iuran = Iuran = __decorate([
    (0, typeorm_1.Index)(['user', 'tanggalJatuhTempo']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Entity)({ name: 'iuran' })
], Iuran);
//# sourceMappingURL=iuran.entity.js.map