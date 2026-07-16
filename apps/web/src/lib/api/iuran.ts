import apiClient from '../api-client';

export interface Iuran {
  id: string;
  warga_id: string;
  jenis: 'iuran_wajib' | 'iuran_sukarela';
  nominal: number;
  bulan: number; // 1-12
  tahun: number;
  status: 'belum_bayar' | 'lunas' | 'terlambat';
  keterangan?: string;
  created_at: string;
  updated_at: string;
  warga?: {
    name: string;
    address: string;
  };
}

export interface CreateIuranPayload {
  warga_id: string;
  jenis: 'iuran_wajib' | 'iuran_sukarela';
  nominal: number;
  bulan: number;
  tahun: number;
  keterangan?: string;
}

export interface UpdateIuranPayload {
  status?: 'belum_bayar' | 'lunas' | 'terlambat';
  keterangan?: string;
}

export const iuranApi = {
  getAll: async (params?: { bulan?: number; tahun?: number; status?: string }): Promise<Iuran[]> => {
    const response = await apiClient.get('/iuran', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Iuran> => {
    const response = await apiClient.get(`/iuran/${id}`);
    return response.data;
  },

  create: async (payload: CreateIuranPayload): Promise<Iuran> => {
    const response = await apiClient.post('/iuran', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateIuranPayload): Promise<Iuran> => {
    const response = await apiClient.patch(`/iuran/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/iuran/${id}`);
  },
};
