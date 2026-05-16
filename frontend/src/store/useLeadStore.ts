import { create } from 'zustand';
import axios from 'axios';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface LeadStore {
  leads: Lead[];
  loading: boolean;
  total: number;
  token: string | null;
  fetchLeads: (params?: Record<string, unknown>) => Promise<void>;
  importLeads: (csvData: any[]) => Promise<void>;
  createLead: (leadData: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, leadData: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  loading: false,
  total: 0,
  token: localStorage.getItem('token'),
  
  fetchLeads: async (params = {}) => {
    set({ loading: true });
    try {
      let currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        set({ loading: false });
        return;
      }

      const { data } = await axios.get('/leads', { 
        params,
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      
      set({ leads: data.data.leads, total: data.metadata.total, loading: false });
    } catch (error: any) {
      console.error('Fetch Leads Error:', error);
      // If token expired or invalid, clear it and retry login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, loading: false });
        window.location.href = '/login';
      } else {
        set({ loading: false });
      }
    }
  },

  importLeads: async (csvData: any[]) => {
    set({ loading: true });
    try {
      const currentToken = localStorage.getItem('token');
      await axios.post('/leads/bulk', { leads: csvData }, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      await get().fetchLeads();
    } catch (error: any) {
      console.error('Import Leads Error:', error.response?.data || error);
      set({ loading: false });
      throw error;
    }
  },

  createLead: async (leadData) => {
    set({ loading: true });
    try {
      const currentToken = localStorage.getItem('token');
      await axios.post('/leads', leadData, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      await get().fetchLeads();
    } catch (error: any) {
      console.error('Create Lead Error:', error.response?.data || error);
      set({ loading: false });
      throw error;
    }
  },

  updateLead: async (id, leadData) => {
    set({ loading: true });
    try {
      const currentToken = localStorage.getItem('token');
      await axios.patch(`/leads/${id}`, leadData, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      await get().fetchLeads();
    } catch (error: any) {
      console.error('Update Lead Error:', error.response?.data || error);
      set({ loading: false });
      throw error;
    }
  },

  deleteLead: async (id) => {
    set({ loading: true });
    try {
      const currentToken = localStorage.getItem('token');
      await axios.delete(`/leads/${id}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      await get().fetchLeads();
    } catch (error: any) {
      console.error('Delete Lead Error:', error.response?.data || error);
      set({ loading: false });
      throw error;
    }
  },
}));

export default useLeadStore;
