import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const tokenCompany = localStorage.getItem('token_empresa');
  const tokenUser = localStorage.getItem('token_usuario');
  const tokenAdmin = localStorage.getItem('token_admin');

  // Prioriza token da empresa para rotas de vagas; depois usuário; por último admin.
  const token = tokenCompany || tokenUser || tokenAdmin;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
