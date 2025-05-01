import axios from 'axios';
import { AuthResponse, Task, TaskFormData, TaskReorderData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

// Tasks API
export const tasksAPI = {
  createTask: async (data: TaskFormData): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  updateTask: async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  getTopPriorityTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/top');
    return response.data;
  },
  reorderTasks: async (data: TaskReorderData): Promise<void> => {
    await api.post('/tasks/reorder', data);
  },
}; 