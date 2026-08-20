import apiClient from '../api-client';

export interface Aduan {
  id: string;
  warga_id: string;
  judul: string;
  isi: string;
  kategori: 'infrastruktur' | 'keamanan' | 'kebersihan' | 'lainnya';
  status: 'pending' | 'proses' | 'selesai' | 'ditolak';
  prioritas: 'rendah' | 'sedang' | 'tinggi';
  lokasi?: string;
  foto_url?: string;
  respon?: string;
  created_at: string;
  updated_at: string;
  warga?: {
    name: string;
  };
}

export interface CreateAduanPayload {
  judul: string;
  isi: string;
  kategori: 'infrastruktur' | 'keamanan' | 'kebersihan' | 'lainnya';
  prioritas: 'rendah' | 'sedang' | 'tinggi';
  lokasi?: string;
  foto?: File;
}

export interface UpdateAduanPayload {
  status?: 'pending' | 'proses' | 'selesai' | 'ditolak';
  respon?: string;
  prioritas?: 'rendah' | 'sedang' | 'tinggi';
}

export const aduanApi = {
  getAll: async (params?: { status?: string }): Promise<Aduan[]> => {
    const response = await apiClient.get('/aduan', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Aduan> => {
    const response = await apiClient.get(`/aduan/${id}`);
    return response.data;
  },

  create: async (payload: FormData): Promise<Aduan> => {
    const response = await apiClient.post('/aduan', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, payload: UpdateAduanPayload): Promise<Aduan> => {
    const response = await apiClient.patch(`/aduan/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/aduan/${id}`);
  },
};
