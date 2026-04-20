# Authentication Flow

This document explains the login/signup flow, token handling strategy, and protected routes implementation.

## Authentication Architecture

The authentication system uses JWT (JSON Web Tokens) with the following flow:

1. **Login/Signup** - User credentials sent to API
2. **Token Reception** - Server returns access and refresh tokens
3. **Token Storage** - Tokens stored in localStorage
4. **Authenticated Requests** - Access token sent in Authorization header
5. **Token Refresh** - Automatic refresh when access token expires
6. **Logout** - Tokens cleared and user redirected

## Login Flow

### 1. Login Form Submission

```typescript
// src/features/auth/login-form.tsx
const onSubmit = async (data: LoginFormData) => {
  try {
    await login.mutateAsync(data);
    addToast('Login successful!', 'success');
    // Redirect handled by auth state change
  } catch (error: any) {
    addToast(error.message || 'Login failed', 'error');
  }
};
```

### 2. Authentication Service

```typescript
// src/services/auth.ts
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/login',
      credentials
    );
    
    const { user, tokens } = response.data.data;
    
    // Store tokens
    tokenStorage.setAccessToken(tokens.accessToken);
    tokenStorage.setRefreshToken(tokens.refreshToken);
    
    return { user, tokens };
  }
}
```

### 3. Token Storage

```typescript
// src/services/api.ts
const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(env.AUTH_TOKEN_KEY);
  },
  
  setAccessToken: (token: string): void => {
    localStorage.setItem(env.AUTH_TOKEN_KEY, token);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem(env.AUTH_TOKEN_KEY);
    localStorage.removeItem(env.REFRESH_TOKEN_KEY);
  },
};
```

## Signup Flow

### 1. Registration Form

Similar to login form with additional fields:

```typescript
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});
```

### 2. Registration Service

```typescript
export class AuthService {
  static async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/register',
      credentials
    );
    
    const { user, tokens } = response.data.data;
    
    // Store tokens
    tokenStorage.setAccessToken(tokens.accessToken);
    tokenStorage.setRefreshToken(tokens.refreshToken);
    
    return { user, tokens };
  }
}
```

## Token Handling Strategy

### Access Token

- **Purpose**: Short-lived token for API requests
- **Duration**: Typically 15-60 minutes
- **Storage**: localStorage
- **Usage**: Sent in Authorization header: `Bearer <token>`

### Refresh Token

- **Purpose**: Long-lived token for obtaining new access tokens
- **Duration**: Typically 7-30 days
- **Storage**: localStorage
- **Usage**: Sent to refresh endpoint when access token expires

### Automatic Token Refresh

The Axios interceptor handles automatic token refresh:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        const { accessToken } = response.data.data;
        tokenStorage.setAccessToken(accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Protected Routes

### Route Guards

Protected routes use TanStack Router's `beforeLoad` function:

```typescript
// src/app/router.tsx
const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'dashboard',
  component: DashboardComponent,
  beforeLoad: () => {
    requireAuth();
  },
});

function requireAuth() {
  if (!checkAuth()) {
    throw new Error('Authentication required');
  }
}
```

### Authentication Check

```typescript
function checkAuth(): boolean {
  return AuthService.isAuthenticated();
}

// In AuthService
static isAuthenticated(): boolean {
  return !!tokenStorage.getAccessToken();
}
```

### Redirect Handling

When authentication fails, users are redirected to login:

```typescript
// In token refresh failure
tokenStorage.clearTokens();
window.location.href = '/login';
```

## Password Reset Flow

### 1. Forgot Password

```typescript
// Form submission
const forgotPassword = useForgotPassword();
await forgotPassword.mutateAsync(email);

// Service method
static async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
  await api.post('/auth/forgot-password', request);
}
```

### 2. Reset Password

```typescript
// Form with token and new password
const resetPassword = useResetPassword();
await resetPassword.mutateAsync({ token, password });

// Service method
static async resetPassword(request: ResetPasswordRequest): Promise<void> {
  await api.post('/auth/reset-password', request);
}
```

## Authentication Hooks

### useAuth Hook

```typescript
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
```

### useLogin Hook

```typescript
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
  });
}
```

### useLogout Hook

```typescript
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}
```

## Security Best Practices

### 1. Token Storage

- Use localStorage for tokens (consider httpOnly cookies for higher security)
- Clear tokens on logout and token refresh failure
- Implement token expiration checking

### 2. Request Security

- Always use HTTPS in production
- Include CSRF tokens if using cookie-based auth
- Validate tokens on the server side

### 3. Error Handling

- Don't expose sensitive error information
- Implement rate limiting on login attempts
- Log security events appropriately

### 4. Session Management

- Implement idle timeout for automatic logout
- Provide manual logout functionality
- Handle concurrent login scenarios

## Environment Variables

Configure authentication settings in `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH_TOKEN_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token
```

## Testing Authentication

### Mock Authentication

For testing, you can mock the auth service:

```typescript
// Mock AuthService for testing
jest.mock('../services/auth', () => ({
  AuthService: {
    login: jest.fn().mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      tokens: { accessToken: 'mock-token', refreshToken: 'mock-refresh' }
    }),
    isAuthenticated: jest.fn().mockReturnValue(true),
  },
}));
```

### Integration Testing

Test the complete authentication flow:

```typescript
test('should login successfully', async () => {
  const { result } = renderHook(() => useLogin());
  
  await act(async () => {
    await result.current.mutateAsync({ email: 'test@example.com', password: 'password' });
  });
  
  expect(result.current.isSuccess).toBe(true);
  expect(localStorage.getItem('auth_token')).toBeTruthy();
});
```

This authentication system provides a secure, user-friendly experience with automatic token management and protected routes.
