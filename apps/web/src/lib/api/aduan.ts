import apiClient from '../api-client';
import { Aduan, CreateAduanDto, UpdateAduanDto, AduanPaginationResult } from '@/types/api/aduan';

export const aduanApi = {
  /**
   * Get all aduan with pagination and filters
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    kategori?: string;
  }): Promise<AduanPaginationResult> => {
    const response = await apiClient.get('/aduan', { params });
    return response.data;
  },

  /**
   * Get aduan statistics
   */
  getStats: async (): Promise<{ data: any }> => {
    const response = await apiClient.get('/aduan/stats');
    return response.data;
  },

  /**
   * Get aduan by ID
   */
  getById: async (id: string): Promise<Aduan> => {
    const response = await apiClient.get(`/aduan/${id}`);
    return response.data;
  },

  /**
   * Get aduan by user ID
   */
  getByUser: async (userId: string): Promise<Aduan[]> => {
    const response = await apiClient.get(`/aduan/user/${userId}`);
    return response.data;
  },

  /**
   * Create a new aduan (with file upload)
   */
  create: async (formData: FormData): Promise<Aduan> => {
    const response = await apiClient.post('/aduan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Update aduan status (admin only)
   */
  updateStatus: async (
    id: string,
    status: string,
  ): Promise<Aduan> => {
    const response = await apiClient.put(`/aduan/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update an aduan
   */
  update: async (id: string, payload: UpdateAduanDto): Promise<Aduan> => {
    const response = await apiClient.put(`/aduan/${id}`, payload);
    return response.data;
  },

  /**
   * Delete an aduan
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/aduan/${id}`);
  },
};
