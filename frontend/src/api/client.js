import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: false,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});