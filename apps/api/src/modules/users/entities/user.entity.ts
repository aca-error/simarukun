import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum';
import { AuditLog } from '../../audit/audit.entity';
import { Iuran } from '../../iuran/entities/iuran.entity';
import { Aduan } from '../../aduan/entities/aduan.entity';

@Index(['email'], { unique: true })
@Index(['role'])
@Index(['isActive'])
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nama: string;

  @Column({ length: 255, unique: true })
  @Index()
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WARGA,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, length: 500 })
  refreshToken: string | null;

  @Column({ nullable: true, length: 50 })
  phone: string | null;

  @Column({ nullable: true, length: 255 })
  address: string | null;

  @Column({ nullable: true, length: 100 })
  rt: string | null;

  @Column({ nullable: true, length: 100 })
  rw: string | null;

  @Column({ nullable: true, length: 255 })
  avatar: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Iuran, (iuran) => iuran.user)
  iurans: Iuran[];

  @OneToMany(() => Aduan, (aduan) => aduan.user)
  aduans: Aduan[];
}
