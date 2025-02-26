"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { api, ApiError } from '@/utils/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token is valid by making a test request
        try {
          await api.expenses.getAll();
          setUser({ token });
        } catch (error) {
          if (error.status === 401) {
            localStorage.removeItem('token');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      const { token } = response;
      
      if (!token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', token);
      setUser({ token });
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
