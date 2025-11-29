import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const tokenUser = localStorage.getItem('token_usuario');
  const tokenCompany = localStorage.getItem('token_empresa');
  const token = tokenUser || tokenCompany;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});