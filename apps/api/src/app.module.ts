import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IuranModule } from './modules/iuran/iuran.module';
import { AduanModule } from './modules/aduan/aduan.module';
import { LaporanModule } from './modules/laporan/laporan.module';
import { BackupModule } from './modules/backup/backup.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { ServerModule } from './modules/server/server.module';
import { HealthModule } from './modules/health/health.module';
import { LoggerModule } from './modules/logger/logger.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true,
      ssl: process.env.NODE_ENV === 'production',
      extra: {
        max: 20, // Connection pool size
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
      },
    }),

    // Rate Limiting (PHASE 1 - Task 2)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 detik
        limit: 5, // 5 request per detik
      },
      {
        name: 'medium',
        ttl: 60000, // 1 menit
        limit: 100, // 100 request per menit
      },
      {
        name: 'long',
        ttl: 3600000, // 1 jam
        limit: 1000, // 1000 request per jam
      },
    ]),

    // Feature Modules
    AuditModule,
    AuthModule,
    UsersModule,
    IuranModule,
    AduanModule,
    LaporanModule,
    BackupModule,
    WebhookModule,
    ServerModule,
    HealthModule,
    LoggerModule,
    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
