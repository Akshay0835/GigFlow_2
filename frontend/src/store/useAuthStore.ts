import { create } from 'zustand';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  inviteMember: (email: string, role: string) => Promise<void>;
  updateProfile: (data: { name: string, bio: string }) => Promise<void>;
  updatePassword: (data: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/v1/auth/login', credentials);
      const { token, data: resData } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      set({ 
        token, 
        user: resData.user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },

  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/v1/auth/register', userData);
      // Wait, register now returns `status: 'pending_verification'` and does NOT log user in!
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Signup failed', 
        loading: false 
      });
      throw error;
    }
  },

  verifyEmail: async (email: string, code: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/v1/auth/verify', { email, code });
      const { token, data: resData } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      set({ 
        token, 
        user: resData.user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Verification failed', 
        loading: false 
      });
      throw error;
    }
  },

  inviteMember: async (email: string, role: string) => {
    set({ loading: true, error: null });
    try {
      const currentToken = localStorage.getItem('token');
      await axios.post('/api/v1/auth/invite', { email, role }, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Invitation failed', 
        loading: false 
      });
      throw error;
    }
  },

  updateProfile: async (data: { name: string, bio: string }) => {
    set({ loading: true, error: null });
    try {
      const currentToken = localStorage.getItem('token');
      const res = await axios.put('/api/v1/auth/me', data, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const updatedUser = res.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update profile', 
        loading: false 
      });
      throw error;
    }
  },

  updatePassword: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const currentToken = localStorage.getItem('token');
      const res = await axios.put('/api/v1/auth/updatePassword', data, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      set({ token, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update password', 
        loading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
