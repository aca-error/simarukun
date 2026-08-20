import { User } from '../../users/entities/user.entity';
export type IuranStatus = 'BELUM_BAYAR' | 'SUDAH_BAYAR' | 'TELAT';
export declare class Iuran {
    id: string;
    judul: string;
    deskripsi: string | null;
    jumlah: number;
    tanggalJatuhTempo: Date;
    status: IuranStatus;
    tanggalPembayaran: Date | null;
    buktiPembayaran: string | null;
    catatan: string | null;
    user: User | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
