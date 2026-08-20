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
exports.OwnerGuard = exports.CheckOwner = exports.OWNER_CHECK_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_role_enum_1 = require("../enums/user-role.enum");
exports.OWNER_CHECK_KEY = 'owner_check';
const CheckOwner = () => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(exports.OWNER_CHECK_KEY, true, target, propertyKey);
    };
};
exports.CheckOwner = CheckOwner;
let OwnerGuard = class OwnerGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const checkOwner = this.reflector.get(exports.OWNER_CHECK_KEY, context.getHandler());
        if (!checkOwner) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const params = request.params;
        if (!user || !user.id) {
            throw new common_1.ForbiddenException('Unauthorized');
        }
        const userIdParam = params.userId || params.id;
        if (userIdParam && userIdParam !== user.id) {
            const allowedRoles = [user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN];
            if (allowedRoles.includes(user.role)) {
                return true;
            }
            throw new common_1.ForbiddenException('You can only access your own resources');
        }
        return true;
    }
};
exports.OwnerGuard = OwnerGuard;
exports.OwnerGuard = OwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], OwnerGuard);
//# sourceMappingURL=owner.guard.js.map