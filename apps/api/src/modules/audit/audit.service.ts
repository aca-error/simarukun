import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Log an action performed by a user
   * @param action - The action performed (e.g., 'LOGIN', 'CREATE_USER')
   * @param user - The user who performed the action
   * @param metadata - Additional data about the action
   * @param ipAddress - IP address of the request
   * @param userAgent - User agent of the request
   */
  async logAction(
    action: string,
    user: User | null,
    metadata: Record<string, any> = {},
    ipAddress: string | null = null,
    userAgent: string | null = null,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      action: action,
      metadata,
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
      user: user ?? undefined,
    });

    return this.auditLogRepository.save(auditLog);
  }

  /**
   * Get audit logs, optionally filtered by user
   * @param userId - Optional user ID to filter by
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  async getAuditLogs(
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: userId ? { user: { id: userId } } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return { data, total, page, limit };
  }

  /**
   * Get audit logs by action type
   * @param action - Action type to filter by
   */
  async getAuditLogsByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Get recent audit logs (last N entries)
   * @param count - Number of recent logs to retrieve
   */
  async getRecentAuditLogs(count: number = 10): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { createdAt: 'DESC' },
      take: count,
      relations: ['user'],
    });
  }
}
