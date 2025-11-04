import axios from 'axios';

// API Configuration
const isProduction = import.meta.env.PROD;
const baseURL = isProduction ? window.location.origin : '';

// Create axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 seconds
  withCredentials: false
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to avoid caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    // Log request in development
    if (!isProduction) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (!isProduction) {
      console.log(`[API] Response ${response.status} ${response.config.url}`, {
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };
    
    console.error('[API] Response error:', errorInfo);
    
    // Handle specific error statuses
    if (error.response) {
      // Server responded with a status code outside 2xx
      if (error.response.status === 401) {
        // Handle unauthorized
        console.error('Authentication required');
      } else if (error.response.status === 404) {
        console.error('API endpoint not found:', error.config.url);
      } else if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

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
