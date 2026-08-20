"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_zod_1 = require("nestjs-zod");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const audit_module_1 = require("./modules/audit/audit.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const iuran_module_1 = require("./modules/iuran/iuran.module");
const aduan_module_1 = require("./modules/aduan/aduan.module");
const laporan_module_1 = require("./modules/laporan/laporan.module");
const backup_module_1 = require("./modules/backup/backup.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const server_module_1 = require("./modules/server/server.module");
const health_module_1 = require("./modules/health/health.module");
const logger_module_1 = require("./modules/logger/logger.module");
const logger_interceptor_1 = require("./modules/logger/logger.interceptor");
const monitoring_module_1 = require("./modules/monitoring/monitoring.module");
const metrics_interceptor_1 = require("./modules/monitoring/metrics.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    `.env.${process.env.NODE_ENV}.local`,
                    `.env.${process.env.NODE_ENV}`,
                    '.env',
                ],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: process.env.NODE_ENV !== 'production',
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                migrationsRun: true,
                ssl: process.env.NODE_ENV === 'production',
                extra: {
                    max: 20,
                    connectionTimeoutMillis: 5000,
                    idleTimeoutMillis: 10000,
                },
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            audit_module_1.AuditModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            iuran_module_1.IuranModule,
            aduan_module_1.AduanModule,
            laporan_module_1.LaporanModule,
            backup_module_1.BackupModule,
            webhook_module_1.WebhookModule,
            server_module_1.ServerModule,
            health_module_1.HealthModule,
            logger_module_1.LoggerModule,
            monitoring_module_1.MonitoringModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: nestjs_zod_1.ZodValidationPipe,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logger_interceptor_1.LoggerInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: metrics_interceptor_1.MetricsInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map