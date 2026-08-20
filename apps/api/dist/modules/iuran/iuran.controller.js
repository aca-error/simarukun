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
exports.IuranController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const iuran_service_1 = require("./iuran.service");
const create_iuran_dto_1 = require("./dto/create-iuran.dto");
const update_iuran_dto_1 = require("./dto/update-iuran.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const swagger_1 = require("@nestjs/swagger");
let IuranController = class IuranController {
    constructor(iuranService) {
        this.iuranService = iuranService;
    }
    async findAll(req, page = 1, limit = 10, status, tahun, bulan) {
        return this.iuranService.findAll(page, limit, status, tahun, bulan);
    }
    async getReport(tahun, bulan, req) {
        return this.iuranService.getReport(tahun, bulan);
    }
    async findByUser(userId, req) {
        if (req.user.role === user_role_enum_1.UserRole.WARGA && req.user.id !== userId) {
            throw new common_1.ForbiddenException('Anda hanya dapat melihat iuran sendiri');
        }
        return this.iuranService.findByUser(userId);
    }
    async findOne(id, req) {
        const iuran = await this.iuranService.findOne(id);
        if (req.user.role === user_role_enum_1.UserRole.WARGA && iuran.userId !== req.user.id) {
            throw new common_1.ForbiddenException('Anda hanya dapat melihat iuran sendiri');
        }
        return iuran;
    }
    async create(createIuranDto, req) {
        return this.iuranService.create(createIuranDto, req.user);
    }
    async update(id, updateIuranDto, req) {
        return this.iuranService.update(id, updateIuranDto, req.user);
    }
    async remove(id, req) {
        return this.iuranService.remove(id, req.user);
    }
};
exports.IuranController = IuranController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all iuran records (Super Admin, Supervisor, Admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'tahun', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'bulan', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('tahun')),
    __param(5, (0, common_1.Query)('bulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('report'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get iuran report (Super Admin, Supervisor, Admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'tahun', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'bulan', required: false, type: Number }),
    __param(0, (0, common_1.Query)('tahun')),
    __param(1, (0, common_1.Query)('bulan')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.WARGA),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get iuran history for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.WARGA),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get iuran by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new iuran record (Super Admin, Supervisor, Admin)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_iuran_dto_1.CreateIuranDto, Object]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update an iuran record (Super Admin, Supervisor, Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_iuran_dto_1.UpdateIuranDto, Object]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an iuran record (Super Admin & Supervisor only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IuranController.prototype, "remove", null);
exports.IuranController = IuranController = __decorate([
    (0, swagger_1.ApiTags)('Iuran'),
    (0, common_1.Controller)('iuran'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [iuran_service_1.IuranService])
], IuranController);
//# sourceMappingURL=iuran.controller.js.map