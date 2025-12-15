import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@store';

/**
 * Get API base URL based on current environment
 */
const getApiBaseUrl = (): string => {
  const env = import.meta.env.VITE_APP_ENV || 'prod';
  
  switch (env) {
    case 'dev':
      return import.meta.env.VITE_API_BASE_URL_DEV || 'http://13.51.107.20/api';
    case 'stage':
      return import.meta.env.VITE_API_BASE_URL_STAGE || 'https://dev.the-pilatesroom.com/prod/api';
    case 'prod':
      return import.meta.env.VITE_API_BASE_URL_PROD || 'https://dev.the-pilatesroom.com/prod/api';
    default:
      // Fallback to production for safety
      return import.meta.env.VITE_API_BASE_URL_PROD || 'https://dev.the-pilatesroom.com/prod/api';
  }
};

// Base URL from environment
const BASE_URL = getApiBaseUrl();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details for debugging
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
      data: config.data,
      headers: { ...config.headers, Authorization: token ? 'Bearer ***' : undefined }
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;
    
    // Log error response
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized - logout user
    if (response?.status === 401) {
      const { logout } = useAuthStore.getState();
      await logout();
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    
    // Handle other error codes
    if (response?.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    }
    
    if (response?.status === 404) {
      console.error('Not Found: The requested resource was not found');
    }
    
    if (response && response.status >= 500) {
      console.error('Server Error: Something went wrong on the server');
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then(res => res.data),
    
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then(res => res.data),
    
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then(res => res.data),
    
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then(res => res.data),
    
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then(res => res.data),
};

export default apiClient;
