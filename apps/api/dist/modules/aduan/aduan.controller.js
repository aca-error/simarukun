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
exports.AduanController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const throttler_1 = require("@nestjs/throttler");
const aduan_service_1 = require("./aduan.service");
const create_aduan_dto_1 = require("./dto/create-aduan.dto");
const update_aduan_dto_1 = require("./dto/update-aduan.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const swagger_1 = require("@nestjs/swagger");
let AduanController = class AduanController {
    constructor(aduanService) {
        this.aduanService = aduanService;
    }
    async findAll(req, page = 1, limit = 10, status, kategori) {
        return this.aduanService.findAll(page, limit, status, kategori);
    }
    async getStats(req) {
        return this.aduanService.getStats();
    }
    async findByUser(userId, req) {
        if (req.user.role === user_role_enum_1.UserRole.WARGA && req.user.id !== userId) {
            throw new common_1.ForbiddenException('Anda hanya dapat melihat aduan sendiri');
        }
        return this.aduanService.findByUser(userId);
    }
    async findOne(id, req) {
        const aduan = await this.aduanService.findOne(id);
        if (req.user.role === user_role_enum_1.UserRole.WARGA && aduan.userId !== req.user.id) {
            throw new common_1.ForbiddenException('Anda hanya dapat melihat aduan sendiri');
        }
        return aduan;
    }
    async create(createAduanDto, req, file) {
        return this.aduanService.create(createAduanDto, file, req.user);
    }
    async updateStatus(id, status, req) {
        return this.aduanService.updateStatus(id, status, req.user);
    }
    async update(id, updateAduanDto, req) {
        return this.aduanService.update(id, updateAduanDto, req.user);
    }
    async remove(id, req) {
        return this.aduanService.remove(id, req.user);
    }
};
exports.AduanController = AduanController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all aduan records (Super Admin, Supervisor, Admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'kategori', required: false, type: String }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('kategori')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get aduan statistics (Super Admin, Supervisor, Admin)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.WARGA),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get aduan by user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.WARGA),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get aduan by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.WARGA),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new aduan' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedMimes.includes(file.mimetype)) {
                cb(new common_1.BadRequestException('Format file tidak didukung. Gunakan JPG, PNG, atau PDF'), false);
                return;
            }
            cb(null, true);
        },
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads'),
            filename: (_req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${(0, uuid_1.v4)()}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_aduan_dto_1.CreateAduanDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update aduan status (Super Admin, Supervisor, Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update an aduan (Super Admin, Supervisor, Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_aduan_dto_1.UpdateAduanDto, Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an aduan (Super Admin & Supervisor only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AduanController.prototype, "remove", null);
exports.AduanController = AduanController = __decorate([
    (0, swagger_1.ApiTags)('Aduan'),
    (0, common_1.Controller)('aduan'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [aduan_service_1.AduanService])
], AduanController);
//# sourceMappingURL=aduan.controller.js.map