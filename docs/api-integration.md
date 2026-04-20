# API Integration Guide

This guide explains how Axios is configured, how to add new API endpoints, and how TanStack Query is used for data management.

## Axios Configuration

### Central Instance Setup

The application uses a centralized Axios instance configured in `src/services/api.ts`:

```typescript
import axios from 'axios';
import { env } from '../lib/env';

const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor

Automatically adds authentication headers to outgoing requests:

```typescript
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles errors and automatic token refresh:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt token refresh
      const refreshToken = tokenStorage.getRefreshToken();
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

## Adding New API Endpoints

### 1. Define Types

First, define the TypeScript interfaces in `src/types/index.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
}
```

### 2. Create Service Class

Create a service class in `src/services/`:

```typescript
// src/services/users.ts
import { api } from './api';
import type { User, CreateUserData, UpdateUserData, ApiResponse } from '../types';

export class UsersService {
  /**
   * Get all users
   */
  static async getUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  }

  /**
   * Get user by ID
   */
  static async getUser(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  /**
   * Create new user
   */
  static async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}
```

### 3. Add Query Keys

Update query keys in `src/lib/query-client.ts`:

```typescript
export const queryKeys = {
  // ... existing keys
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
};
```

### 4. Create Custom Hooks

Create hooks in `src/hooks/`:

```typescript
// src/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '../services/users';
import { queryKeys } from '../lib/query-client';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: () => UsersService.getUsers(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => UsersService.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserData) => UsersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      UsersService.updateUser(id, data),
    onSuccess: (updatedUser, { id }) => {
      queryClient.setQueryData(queryKeys.users.detail(id), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => UsersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}
```

## TanStack Query Usage

### Queries (Data Fetching)

```typescript
// Basic query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => UsersService.getUsers(),
});

// Query with options
const { data, isLoading, error } = useQuery({
  queryKey: ['users', { page, search }],
  queryFn: () => UsersService.getUsers({ page, search }),
  enabled: !!search,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Dependent query
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => UsersService.getUser(userId),
  enabled: !!userId,
});
```

### Mutations (Data Updates)

```typescript
// Simple mutation
const createUser = useMutation({
  mutationFn: (userData) => UsersService.createUser(userData),
  onSuccess: () => {
    console.log('User created successfully');
  },
  onError: (error) => {
    console.error('Failed to create user:', error);
  },
});

// Optimistic updates
const updateUser = useMutation({
  mutationFn: ({ id, data }) => UsersService.updateUser(id, data),
  onMutate: async ({ id, data }) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['user', id] });
    
    // Snapshot the previous value
    const previousUser = queryClient.getQueryData(['user', id]);
    
    // Optimistically update
    queryClient.setQueryData(['user', id], (old: any) => ({ ...old, ...data }));
    
    return { previousUser };
  },
  onError: (err, { id }, context) => {
    // Rollback on error
    queryClient.setQueryData(['user', id], context?.previousUser);
  },
  onSettled: (data, error, { id }) => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['user', id] });
  },
});
```

### Query Invalidation

```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['users'] });

// Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['users'] });
queryClient.invalidateQueries({ queryKey: ['dashboard'] });

// Invalidate all queries
queryClient.invalidateQueries();
```

### Prefetching

```typescript
// Prefetch data for better UX
const prefetchUser = (userId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => UsersService.getUser(userId),
  });
};
```

## Error Handling

### API Error Types

```typescript
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}
```

### Error Handling in Components

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => UsersService.getUsers(),
  retry: (failureCount, error: any) => {
    // Don't retry on 4xx errors
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    return failureCount < 3;
  },
});

if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Best Practices

1. **Use Service Classes**: Keep API logic in service classes
2. **Type Safety**: Define interfaces for all API data
3. **Error Handling**: Implement proper error boundaries
4. **Caching Strategy**: Configure appropriate stale time and cache time
5. **Optimistic Updates**: Improve UX with optimistic updates where appropriate
6. **Loading States**: Show loading indicators during data fetching
7. **Query Keys**: Use consistent, hierarchical query keys
8. **Environment Variables**: Configure API URLs via environment variables

This approach ensures type-safe, efficient, and maintainable API integration throughout the application.
