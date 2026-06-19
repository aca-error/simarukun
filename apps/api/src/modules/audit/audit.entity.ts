import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Index(['user', 'action', 'createdAt'])
@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  action: string; // 'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', etc.

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Data sebelum/sesudah perubahan

  @Column({ length: 50, nullable: true })
  ipAddress: string;

  @Column({ length: 255, nullable: true })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: 'SET NULL' })
  @Index()
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
