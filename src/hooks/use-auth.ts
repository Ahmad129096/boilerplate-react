/**
 * Authentication hooks for managing user authentication state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth';
import { queryKeys } from '../lib/query-client';
import type { User, LoginCredentials, RegisterCredentials } from '../types';

/**
 * Hook for getting current user data
 * @returns User query state
 */
export function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => AuthService.getCurrentUser(),
    enabled: AuthService.isAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for login functionality
 * @returns Login mutation with loading state and error handling
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });

      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);

      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Don't show generic error here - let the component handle it
    },
  });
}

/**
 * Hook for registration functionality
 * @returns Register mutation with loading state and error handling
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => AuthService.register(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });

      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);

      // Redirect to dashboard after successful registration
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      // Don't show generic error here - let the component handle it
    },
  });
}

/**
 * Hook for logout functionality
 * @returns Logout mutation with loading state and error handling
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear all query data
      queryClient.clear();

      // Redirect to login page
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still redirect on error
      window.location.href = '/login';
    },
  });
}

/**
 * Hook for checking authentication status
 * @returns Authentication status and user data
 */
export function useAuth() {
  const { data: user, isLoading, error } = useUser();
  const isAuthenticated = AuthService.isAuthenticated();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
}

/**
 * Hook for updating user profile
 * @returns Profile update mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => AuthService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
}

/**
 * Hook for changing password
 * @returns Password change mutation
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      AuthService.changePassword(data),
    onError: (error) => {
      console.error('Password change failed:', error);
    },
  });
}

/**
 * Hook for forgot password functionality
 * @returns Forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword({ email }),
    onError: (error) => {
      console.error('Forgot password failed:', error);
    },
  });
}

/**
 * Hook for reset password functionality
 * @returns Reset password mutation
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      AuthService.resetPassword(data),
    onError: (error) => {
      console.error('Reset password failed:', error);
    },
  });
}
