/**
 * TanStack Query global configuration
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create and configure TanStack Query client
 * @returns Configured QueryClient instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        staleTime: 1000 * 60 * 5, // 5 minutes

        // Time in milliseconds that inactive queries will remain in cache
        gcTime: 1000 * 60 * 10, // 10 minutes

        // Number of times a failed query will be retried
        retry: (failureCount: number, error: any) => {
          // Don't retry on 4xx errors except 408 (Request Timeout) and 429 (Too Many Requests)
          if (error?.status >= 400 && error?.status < 500 &&
            error?.status !== 408 && error?.status !== 429) {
            return false;
          }

          // Retry up to 3 times for other errors
          return failureCount < 3;
        },

        // Delay between retries (exponential backoff)
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus (disabled in production for performance)
        refetchOnWindowFocus: import.meta.env.DEV,

        // Refetch on reconnect
        refetchOnReconnect: true,

        // Enable error logging in development
        throwOnError: (error: any) => {
          if (import.meta.env.DEV) {
            console.error('Query error:', error);
          }
          return false;
        },
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,

        // Enable error logging in development
        throwOnError: (error: any) => {
          if (import.meta.env.DEV) {
            console.error('Mutation error:', error);
          }
          return false;
        },
      },
    },
  });
}

/**
 * Global query client instance
 */
export const queryClient = createQueryClient();

/**
 * Query keys factory for consistent key management
 */
export const queryKeys = {
  // Authentication queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    activity: () => [...queryKeys.dashboard.all, 'activity'] as const,
  },

  // Profile queries
  profile: {
    all: ['profile'] as const,
    settings: () => [...queryKeys.profile.all, 'settings'] as const,
    preferences: () => [...queryKeys.profile.all, 'preferences'] as const,
  },
} as const;

/**
 * Type for query keys
 */
export type QueryKey = typeof queryKeys;
