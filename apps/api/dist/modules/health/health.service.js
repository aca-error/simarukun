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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let HealthService = class HealthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: 'simarukun-api',
            version: process.env.RELEASE_VERSION || '1.0.0',
        };
    }
    async checkDetailed() {
        const startTime = Date.now();
        const checks = {};
        try {
            const dbStart = Date.now();
            const count = await this.usersRepository.count();
            const dbLatency = Date.now() - dbStart;
            checks.database = {
                status: 'ok',
                message: 'Database connection successful',
                latency: dbLatency,
                details: { userCount: count },
            };
        }
        catch (error) {
            checks.database = {
                status: 'error',
                message: error.message,
                details: process.env.NODE_ENV === 'production'
                    ? { error: 'Database connection failed' }
                    : { error: error.stack },
            };
        }
        if (process.memoryUsage) {
            const memory = process.memoryUsage();
            const memoryUsed = memory.heapUsed / 1024 / 1024;
            const memoryTotal = memory.heapTotal / 1024 / 1024;
            const memoryUsage = (memoryUsed / memoryTotal) * 100;
            checks.memory = {
                status: memoryUsage > 80 ? 'degraded' : 'ok',
                message: `Memory usage: ${memoryUsage.toFixed(2)}%`,
                details: {
                    used: `${memoryUsed.toFixed(2)} MB`,
                    total: `${memoryTotal.toFixed(2)} MB`,
                    usage: `${memoryUsage.toFixed(2)}%`,
                },
            };
        }
        if (process.cpuUsage) {
            const cpuStart = process.cpuUsage();
            const now = Date.now();
            while (Date.now() - now < 100) { }
            const cpuEnd = process.cpuUsage(cpuStart);
            const cpuUsage = (cpuEnd.user + cpuEnd.system) / 1000000;
            checks.cpu = {
                status: cpuUsage > 80 ? 'degraded' : 'ok',
                message: `CPU usage: ${cpuUsage.toFixed(2)}%`,
                details: {
                    user: `${(cpuEnd.user / 1000000).toFixed(2)}ms`,
                    system: `${(cpuEnd.system / 1000000).toFixed(2)}ms`,
                },
            };
        }
        const totalLatency = Date.now() - startTime;
        const allOk = Object.values(checks).every((check) => check.status === 'ok');
        const hasErrors = Object.values(checks).some((check) => check.status === 'error');
        return {
            status: hasErrors ? 'error' : allOk ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: 'simarukun-api',
            version: process.env.RELEASE_VERSION || '1.0.0',
            checks,
        };
    }
    async checkDb() {
        try {
            const startTime = Date.now();
            const count = await this.usersRepository.count();
            const latency = Date.now() - startTime;
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                service: 'simarukun-api-database',
                checks: {
                    database: {
                        status: 'ok',
                        message: 'Database connection successful',
                        latency,
                        details: { userCount: count },
                    },
                },
            };
        }
        catch (error) {
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                service: 'simarukun-api-database',
                checks: {
                    database: {
                        status: 'error',
                        message: error.message,
                        details: process.env.NODE_ENV === 'production'
                            ? { error: 'Database connection failed' }
                            : { error: error.stack },
                    },
                },
            };
        }
    }
    async checkRedis() {
        return {
            status: 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: 'simarukun-api-redis',
            checks: {
                redis: {
                    status: 'degraded',
                    message: 'Redis is not configured',
                },
            },
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HealthService);
//# sourceMappingURL=health.service.js.map