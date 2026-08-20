/**
 * Aduan types - aligned with backend API
 */
import { PaginatedResult } from '../api';

export type AduanKategori = 'infrastruktur' | 'keamanan' | 'kebersihan' | 'lainnya';
export type AduanStatus = 'BARU' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';
export type AduanPrioritas = 'RENDAH' | 'SEDANG' | 'TINGGI';

export interface Aduan {
  id: string;
  userId: string;
  judul: string;
  isi?: string;
  deskripsi: string;
  kategori: AduanKategori;
  status: AduanStatus;
  prioritas?: AduanPrioritas;
  lokasi?: string;
  lampiran?: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
  created_at?: string;
  user?: {
    id: string;
    nama: string;
    email: string;
    name?: string;
  };
  warga?: {
    id: string;
    nama: string;
    email: string;
  };
}

export interface CreateAduanDto {
  judul: string;
  deskripsi: string;
  kategori: AduanKategori;
  prioritas?: AduanPrioritas;
  lokasi?: string;
}

export interface UpdateAduanDto {
  judul?: string;
  deskripsi?: string;
  kategori?: AduanKategori;
  prioritas?: AduanPrioritas;
  lokasi?: string;
  status?: AduanStatus;
  catatan?: string;
}

export interface AduanStats {
  total: number;
  baru: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  byKategori: Record<string, number>;
}

export interface AduanPaginationResult extends PaginatedResult<Aduan> {}
