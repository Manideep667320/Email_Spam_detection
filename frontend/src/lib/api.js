import axios from 'axios';

// Use Vercel's environment variable in production, or relative path in development
const baseURL = import.meta.env.PROD 
  ? `${window.location.origin}/api`  // Will use the current domain in production
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function predictSpam(email) {
  try {
    const { data } = await api.post('/predict', { email });
    return data;
  } catch (error) {
    console.error('Error predicting spam:', error);
    throw error;
  }
}

export async function getMetrics() {
  try {
    const { data } = await api.get('/metrics');
    return data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

export default api;
