import axios from 'axios';
import { 
  SearchResult, 
  LoginData, 
  RegisterData, 
  SearchData, 
  AuthResponse,
  ApiResponse,
  User
} from '../types';

const API_BASE = 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<any>> => {
    const response = await api.post('/api/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/profile');
    return response.data;
  }
};

// Search API calls
export const searchAPI = {
  searchMedicine: async (data: SearchData): Promise<SearchResult[]> => {
    const response = await api.post('/api/search_medicine', data);
    return response.data.results;
  },

  searchByPrefix: async (prefix: string): Promise<string[]> => {
    const response = await api.get(`/api/search_by_prefix?prefix=${encodeURIComponent(prefix)}`);
    return response.data.results;
  },

  findNearestPath: async (data: SearchData): Promise<any> => {
    const response = await api.post('/api/find_nearest_path', data);
    return response.data;
  },
};

// Inventory API calls
export const inventoryAPI = {
  uploadInventory: async (file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/inventory/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// User API calls
export const userAPI = {
  deleteAccount: async (): Promise<void> => {
    const response = await api.delete('/api/profile');
    return response.data;
  }
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export default api;