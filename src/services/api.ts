/**
 * Axios configuration with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '../lib/env';
import type { ApiResponse, ApiError, CustomAxiosRequestConfig } from '../types';

/**
 * Custom axios error class for better error handling
 */
export class ApiRequestError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Storage utilities for token management
 */
const tokenStorage = {
  /** Get access token from localStorage */
  getAccessToken: (): string | null => {
    return localStorage.getItem(env.AUTH_TOKEN_KEY);
  },

  /** Get refresh token from localStorage */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(env.REFRESH_TOKEN_KEY);
  },

  /** Set access token in localStorage */
  setAccessToken: (token: string): void => {
    localStorage.setItem(env.AUTH_TOKEN_KEY, token);
  },

  /** Set refresh token in localStorage */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(env.REFRESH_TOKEN_KEY, token);
  },

  /** Remove tokens from localStorage */
  clearTokens: (): void => {
    localStorage.removeItem(env.AUTH_TOKEN_KEY);
    localStorage.removeItem(env.REFRESH_TOKEN_KEY);
  },
};

/**
 * Create and configure axios instance
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const token = tokenStorage.getAccessToken();
      // Don't add auth token for signup requests
      if (token && !config.url?.includes('/auth/signup')) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and token refresh
  instance.interceptors.response.use(
    (response: any) => {
      // Calculate request duration for debugging
      const endTime = new Date();
      const duration = endTime.getTime() - response.config.metadata?.startTime?.getTime();

      if (env.DEV_MODE) {
        console.log(`API Request completed in ${duration}ms:`, response.config.url);
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Handle 401 Unauthorized - attempt token refresh (skip for auth endpoints)
      if (error.response?.status === 401 && !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/')) {
        originalRequest._retry = true;

        try {
          const refreshToken = tokenStorage.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Attempt to refresh the token
          const response = await axios.post(`${env.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          tokenStorage.setAccessToken(accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          tokenStorage.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      console.log({ errorData: error.response?.data })

      let errorMessage = error.response?.data.errors ? Object.values(error.response?.data.errors).map((val) => val).join(", ") : error.response?.data?.message || error.message || 'An unknown error occurred'
      // Handle other errors
      const apiError: ApiError = {
        message: errorMessage,
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      };

      return Promise.reject(new ApiRequestError(
        apiError.message,
        error.response?.status,
        apiError.code,
        apiError.details
      ));
    }
  );

  return instance;
};

/**
 * Configured axios instance
 */
export const api = createApiInstance();

/**
 * Export token storage utilities for use in auth services
 */
export { tokenStorage };

