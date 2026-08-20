import { User } from '../../users/entities/user.entity';
export type AduanStatus = 'BARU' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';
export type AduanKategori = 'KEAMANAN' | 'KEBERSIHAN' | 'FASILITAS' | 'LAINNYA';
export declare class Aduan {
    id: string;
    judul: string;
    deskripsi: string;
    kategori: AduanKategori;
    lampiran: string | null;
    status: AduanStatus;
    catatan: string | null;
    lokasi: string | null;
    user: User | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
