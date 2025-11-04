import axios from 'axios';

// Determine the base URL based on the environment
const getBaseURL = () => {
  // In production, use the current origin (handled by Vercel rewrites)
  if (import.meta.env.PROD) {
    return window.location.origin + '/api';
  }
  // In development, use the proxy defined in vite.config.js
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // Increased timeout for serverless functions
  withCredentials: false
});

// Add request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle HTTP errors
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
