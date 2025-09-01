import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import {
  ApiResponse,
  BaseEntity,
  QueryParams,
  PaginatedResponse,
} from '@/types/api.types';
import { authStorage } from '@/utils/storage';

/**
 * Generic API service layer for all backend communications
 * Implements standard CRUD operations for any entity type
 */

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://lunch-pay-generic-api.onrender.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = authStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle common errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          authStorage.clearAll();
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: AxiosError): Error {
    if (error.response?.data) {
      const apiError = error.response.data as ApiResponse;
      return new Error(apiError.error?.message || 'An error occurred');
    }
    
    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout - please try again');
    }
    
    if (!error.response) {
      return new Error('Network error - please check your connection');
    }
    
    return new Error('An unexpected error occurred');
  }

  /**
   * Generic GET request
   */
  async get<T>(
    endpoint: string,
    params?: QueryParams,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(
      endpoint,
      {
        params,
        ...config,
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed');
    }
    
    return response.data.data as T;
  }

  /**
   * Generic POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(
      endpoint,
      data,
      config
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed');
    }
    
    return response.data.data as T;
  }

  /**
   * Generic PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(
      endpoint,
      data,
      config
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed');
    }
    
    return response.data.data as T;
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.delete(
      endpoint,
      config
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed');
    }
    
    return response.data.data as T;
  }

  /**
   * Generic entity service factory
   * Creates CRUD operations for any entity type
   */
  entity<T extends BaseEntity>(entityName: string) {
    return {
      /**
       * Get all entities with optional pagination and filtering
       */
      getAll: (params?: QueryParams): Promise<PaginatedResponse<T>> =>
        this.get<PaginatedResponse<T>>(`/${entityName}`, params),

      /**
       * Get single entity by ID
       */
      getById: (id: string): Promise<T> =>
        this.get<T>(`/${entityName}/${id}`),

      /**
       * Create new entity
       */
      saveNew: (data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> =>
        this.post<T>(`/${entityName}`, data),

      /**
       * Update existing entity
       */
      update: (data: Partial<T> & { id: string }): Promise<T> =>
        this.put<T>(`/${entityName}/${data.id}`, data),

      /**
       * Delete entity by ID
       */
      delete: (id: string): Promise<void> =>
        this.delete<void>(`/${entityName}/${id}`),
    };
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export specific entity services
export const userApi = apiService.entity('users');
export const groupApi = apiService.entity('groups');

// Export the main service for custom endpoints
export default apiService;
