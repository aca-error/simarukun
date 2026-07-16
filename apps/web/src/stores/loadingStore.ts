import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: null,
  
  setLoading: (loading: boolean, message?: string) => set({ 
    isLoading: loading, 
    loadingMessage: message || null 
  }),
}));
