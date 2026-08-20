import apiClient from '../api-client';

export interface Warga {
  id: string;
  name: string;
  email: string;
  nik: string;
  no_kk: string;
  address: string;
  rt: string;
  rw: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWargaPayload {
  name: string;
  email: string;
  password: string;
  nik: string;
  no_kk: string;
  address: string;
  rt: string;
  rw: string;
  phone?: string;
}

export interface UpdateWargaPayload {
  name?: string;
  address?: string;
  phone?: string;
}

export const wargaApi = {
  getAll: async (): Promise<Warga[]> => {
    const response = await apiClient.get('/warga');
    return response.data;
  },

  getById: async (id: string): Promise<Warga> => {
    const response = await apiClient.get(`/warga/${id}`);
    return response.data;
  },

  create: async (payload: CreateWargaPayload): Promise<Warga> => {
    const response = await apiClient.post('/warga', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateWargaPayload): Promise<Warga> => {
    const response = await apiClient.patch(`/warga/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/warga/${id}`);
  },
};
