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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
const SENSITIVE_FIELDS = ['password', 'refreshToken', 'accessToken', 'token'];
function redactSensitive(data) {
    if (!data || typeof data !== 'object')
        return data;
    if (Array.isArray(data))
        return data.map(redactSensitive);
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (SENSITIVE_FIELDS.includes(key)) {
            sanitized[key] = '[REDACTED]';
        }
        else if (typeof value === 'object' && value !== null) {
            sanitized[key] = redactSensitive(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const method = request.method;
        const path = request.path;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const ipAddress = request.ip || request.headers['x-forwarded-for'] || null;
        const userAgent = request.headers['user-agent'] || null;
        const actionMap = {
            POST: 'CREATE',
            GET: 'READ',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE',
        };
        const action = actionMap[method] || method;
        if (path.includes('/health') || path.includes('/_next') || path.includes('/favicon') || path.includes('/metrics')) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)((data) => {
            const metadata = {
                action,
                path,
                method,
                statusCode,
                resourceId: data?.id || null,
            };
            if (user) {
                this.auditService
                    .logAction(action, user, metadata, ipAddress, userAgent)
                    .catch((error) => {
                    console.error('Failed to log audit action:', error);
                });
            }
            else if (path === '/auth/login' || path === '/auth/register') {
                const sanitizedBody = redactSensitive(request.body || {});
                this.auditService
                    .logAction(action, null, { ...metadata, email: request.body?.email }, ipAddress, userAgent)
                    .catch((error) => {
                    console.error('Failed to log audit action:', error);
                });
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map