import axios from 'axios';

// Create an Axios instance with base URL for the FastAPI backend
const api = axios.create({
  // baseURL: 'http://localhost:8000/api/v1',
  baseURL: 'https://seo-analyzer-backend-one.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const WebSocketUrl='wss://seo-analyzer-backend-one.vercel.app/api/v1'

// Add a request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    // Check if we are in a browser environment (localStorage is available)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global auth errors (e.g., 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // We can redirect to login page if needed
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
           window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
