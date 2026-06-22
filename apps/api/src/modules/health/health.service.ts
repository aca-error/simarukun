import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

interface HealthCheckResult {
  status: 'ok' | 'error' | 'degraded';
  timestamp: string;
  uptime: number;
  service: string;
  version?: string;
  checks?: Record<string, HealthCheckStatus>;
}

interface HealthCheckStatus {
  status: 'ok' | 'error' | 'degraded';
  message?: string;
  latency?: number;
  details?: any;
}

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Basic health check
   */
  async check(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'simarukun-api',
      version: process.env.RELEASE_VERSION || '1.0.0',
    };
  }

  /**
   * Detailed health check with dependencies
   */
  async checkDetailed(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const checks: Record<string, HealthCheckStatus> = {};

    // Check database
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
    } catch (error) {
      checks.database = {
        status: 'error',
        message: error.message,
        details: { error: error.stack },
      };
    }

    // Check memory usage
    if (process.memoryUsage) {
      const memory = process.memoryUsage();
      const memoryUsed = memory.heapUsed / 1024 / 1024; // MB
      const memoryTotal = memory.heapTotal / 1024 / 1024; // MB
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

    // Check CPU usage (approximate)
    if (process.cpuUsage) {
      const cpuStart = process.cpuUsage();
      // Do some work to measure CPU
      const now = Date.now();
      while (Date.now() - now < 100) {}
      const cpuEnd = process.cpuUsage(cpuStart);

      const cpuUsage = (cpuEnd.user + cpuEnd.system) / 1000000; // microseconds to milliseconds
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

  /**
   * Database health check
   */
  async checkDb(): Promise<HealthCheckResult> {
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
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'simarukun-api-database',
        checks: {
          database: {
            status: 'error',
            message: error.message,
            details: { error: error.stack },
          },
        },
      };
    }
  }

  /**
   * Redis health check (placeholder - will be implemented when Redis is added)
   */
  async checkRedis(): Promise<HealthCheckResult> {
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
}
