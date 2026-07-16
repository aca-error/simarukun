import axios from 'axios';
import { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nama: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Login user with credentials
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return data;
};

/**
 * Register new user
 */
export const registerApi = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
  return data;
};

/**
 * Logout user
 */
export const logoutApi = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Get current user profile
 */
export const getProfileApi = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/profile');
  return data;
};

/**
 * Refresh access token
 */
export const refreshTokenApi = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const { data } = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    refreshToken,
  });
  return data;
};

export default apiClient;
