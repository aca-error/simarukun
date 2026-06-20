import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type IuranStatus = 'BELUM_BAYAR' | 'SUDAH_BAYAR' | 'TELAT';

@Index(['user', 'tanggalJatuhTempo'])
@Index(['status'])
@Entity({ name: 'iuran' })
export class Iuran {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  judul: string;

  @Column({ length: 2000, nullable: true })
  deskripsi: string | null;

  @Column('integer')
  jumlah: number;

  @Column({ type: 'date' })
  tanggalJatuhTempo: Date;

  @Column({
    type: 'enum',
    enum: ['BELUM_BAYAR', 'SUDAH_BAYAR', 'TELAT'],
    default: 'BELUM_BAYAR',
  })
  status: IuranStatus;

  @Column({ type: 'date', nullable: true })
  tanggalPembayaran: Date | null;

  @Column({ length: 255, nullable: true })
  buktiPembayaran: string | null;

  @Column({ length: 255, nullable: true })
  catatan: string | null;

  @ManyToOne(() => User, (user) => user.iurans, { onDelete: 'SET NULL' })
  @Index()
  user: User | null;

  @Column({ nullable: true })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
