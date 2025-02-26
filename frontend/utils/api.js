import { API_CONFIG } from '@/config/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const api = {
  async fetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Important for cookies if your backend uses them
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(error.message || 'An error occurred', response.status);
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    login: (credentials) => api.fetch(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  },

  // Expense endpoints
  expenses: {
    getAll: () => api.fetch(API_CONFIG.ENDPOINTS.EXPENSES),
    
    create: (expense) => api.fetch(API_CONFIG.ENDPOINTS.EXPENSES, {
      method: 'POST',
      body: JSON.stringify(expense),
    }),
    
    update: (id, expense) => api.fetch(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),
    
    delete: (id) => api.fetch(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
      method: 'DELETE',
    }),
  },
};