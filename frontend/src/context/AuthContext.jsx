import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('nexus_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem('nexus_token');
          }
        } catch (error) {
          console.error('Session expired or invalid token', error);
          localStorage.removeItem('nexus_token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/signin', { email, password });
      if (res.data.success) {
        localStorage.setItem('nexus_token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true, user: res.data.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const loginWithToken = async (token) => {
    localStorage.setItem('nexus_token', token);
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        return { success: true, user: res.data.data };
      }
    } catch (error) {
      localStorage.removeItem('nexus_token');
    }
    return { success: false };
  }

  const logout = () => {
    localStorage.removeItem('nexus_token');
    setUser(null);
    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
