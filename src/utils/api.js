import axios from 'axios';
import { APP_CONFIG } from '../config/app';
import { secureStorage } from './secureStorage';

/**
 * Global Axios instance with interceptors for authentication and error handling.
 */
const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach auth token to headers
api.interceptors.request.use(
  (config) => {
    const session = secureStorage.get('auth_session');
    if (session && session.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear session on 401 Unauthorized
      secureStorage.remove('auth_session');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
