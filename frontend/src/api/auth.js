import { api } from './client';

export async function login(email, password) {
  const { data } = await api.post('/api/login', { email, password });
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  localStorage.setItem('token', data.token);
  return data.user;
}

export async function register(payload) {
  const { data } = await api.post('/api/register', payload);
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  localStorage.setItem('token', data.token);
  return data.user;
}

// on app start, restore token:
const t = localStorage.getItem('token');
if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;