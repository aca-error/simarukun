import apiClient from '../api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'ketua_rw' | 'warga';
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'warga';
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
