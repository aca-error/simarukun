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

export type AduanStatus = 'BARU' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';
export type AduanKategori = 'KEAMANAN' | 'KEBERSIHAN' | 'FASILITAS' | 'LAINNYA';

@Index(['user', 'status'])
@Index(['kategori'])
@Index(['createdAt'])
@Entity({ name: 'aduan' })
export class Aduan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  judul: string;

  @Column({ type: 'text' })
  deskripsi: string;

  @Column({
    type: 'enum',
    enum: ['KEAMANAN', 'KEBERSIHAN', 'FASILITAS', 'LAINNYA'],
    default: 'LAINNYA',
  })
  kategori: AduanKategori;

  @Column({ length: 255, nullable: true })
  lampiran: string | null;

  @Column({
    type: 'enum',
    enum: ['BARU', 'DIPROSES', 'SELESAI', 'DITOLAK'],
    default: 'BARU',
  })
  status: AduanStatus;

  @Column({ length: 255, nullable: true })
  catatan: string | null;

  @Column({ length: 100, nullable: true })
  lokasi: string | null;

  @ManyToOne(() => User, (user) => user.aduans, { onDelete: 'SET NULL' })
  @Index()
  user: User | null;

  @Column({ nullable: true })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
