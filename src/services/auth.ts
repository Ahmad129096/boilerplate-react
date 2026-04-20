/**
 * Authentication service functions
 */

import { api, tokenStorage } from './api';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse
} from '../types';

/**
 * Authentication service class
 */
export class AuthService {
  /**
   * Login user with email and password
   * @param credentials - Login credentials
   * @returns Promise resolving to user data and tokens
   */
  static async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      '/auth/login',
      credentials
    );

    const { user, accessToken, refreshToken } = response.data.data;

    // Store tokens
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);

    return { user, tokens: { accessToken, refreshToken } };
  }

  /**
   * Register new user
   * @param credentials - Registration credentials
   * @returns Promise resolving to user data and tokens
   */
  static async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      '/auth/signup',
      credentials
    );

    const { user, accessToken, refreshToken } = response.data.data;

    // Store tokens
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);

    return { user, tokens: { accessToken, refreshToken } };
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always clear tokens, even if API call fails
      tokenStorage.clearTokens();
    }
  }

  /**
   * Request password reset
   * @param request - Forgot password request
   */
  static async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await api.post('/auth/forgot-password', request);
  }

  /**
   * Reset password with token
   * @param request - Reset password request
   */
  static async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await api.post('/auth/reset-password', request);
  }

  /**
   * Get current user profile
   * @returns Promise resolving to user data
   */
  static async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  /**
   * Update user profile
   * @param data - Partial user data to update
   * @returns Promise resolving to updated user data
   */
  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data.data;
  }

  /**
   * Change password
   * @param data - Password change data
   */
  static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post('/auth/change-password', data);
  }

  /**
   * Refresh access token
   * @returns Promise resolving to new access token
   */
  static async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );

    const { accessToken } = response.data.data;
    tokenStorage.setAccessToken(accessToken);

    return accessToken;
  }

  /**
   * Check if user is authenticated
   * @returns True if user has valid access token
   */
  static isAuthenticated(): boolean {
    return !!tokenStorage.getAccessToken();
  }

  /**
   * Get stored access token
   * @returns Access token or null
   */
  static getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }
}
