import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('salesai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('salesai_token');
      localStorage.removeItem('salesai_user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default client;
