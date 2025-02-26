export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://thin.ec2.alluvium.net:3001',
  ENDPOINTS: {
    EXPENSES: '/api/expenses',
  }
};

export const api = {
  fetch: async (endpoint, options = {}) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

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
