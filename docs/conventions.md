# Coding Conventions

This document outlines the naming conventions, file structure rules, and best practices used in this frontend boilerplate.

## Naming Conventions

### Files and Folders

#### Component Files

```typescript
// Component files use PascalCase
LoginForm.tsx
UserProfile.tsx
DashboardLayout.tsx
Button.tsx
Input.tsx

// Index files for barrel exports
components/
  ui/
    Button.tsx
    Input.tsx
    index.ts  // Re-exports all UI components
```

#### Hook Files

```typescript
// Hook files use camelCase with 'use' prefix
useAuth.ts
useUsers.ts
useLocalStorage.ts
useDebounce.ts
```

#### Service Files

```typescript
// Service files use PascalCase
AuthService.ts
UsersService.ts
ApiService.ts
```

#### Utility Files

```typescript
// Utility files use camelCase
utils.ts
env.ts
query-client.ts
constants.ts
```

#### Type Files

```typescript
// Type files use camelCase
types.ts
api-types.ts
user-types.ts
```

### Variable and Function Names

#### Variables

```typescript
// Use camelCase for variables
const userName = 'john';
const isAuthenticated = true;
const apiClient = axios.create();

// Constants use UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// Booleans should start with is/has/should
const isLoading = false;
const hasError = true;
const shouldRedirect = true;
```

#### Functions

```typescript
// Use camelCase for functions
function getUserData() {
  // implementation
}

const handleSubmit = () => {
  // implementation
};

// Async functions should be descriptive
async function fetchUserData(userId: string) {
  // implementation
}

// Event handlers start with 'handle'
const handleClick = () => {
  // implementation
};

const handleSubmit = (event: FormEvent) => {
  // implementation
};
```

#### Component Names

```typescript
// Components use PascalCase
export function LoginForm() {
  return <div>...</div>;
}

export const UserProfile = () => {
  return <div>...</div>;
};

// Exported components should be default or named exports consistently
export default Button;  // OR
export { Button };
```

### TypeScript Types

#### Interfaces

```typescript
// Interfaces use PascalCase
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Generic interfaces use descriptive names
interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
```

#### Type Aliases

```typescript
// Type aliases use PascalCase
type UserRole = 'admin' | 'user' | 'moderator';
type Theme = 'light' | 'dark' | 'system';

type LoginCredentials = {
  email: string;
  password: string;
};
```

#### Enums

```typescript
// Enums use PascalCase
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  InternalServerError = 500,
}

enum UserRole {
  Admin = 'admin',
  User = 'user',
  Moderator = 'moderator',
}
```

## File Structure Rules

### Import Order

Organize imports in the following order:

```typescript
// 1. React and core libraries
import React from 'react';
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 3. Internal imports (absolute paths with @ alias)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { AuthService } from '@/services/auth';
import type { User } from '@/types';

// 4. Relative imports
import './styles.css';
import { LocalComponent } from './local-component';
```

### Export Patterns

#### Named Exports (Preferred)

```typescript
// components/ui/button.tsx
export interface ButtonProps {
  // props
}

export function Button(props: ButtonProps) {
  // implementation
}

// Export additional utilities
export const buttonVariants = cva(/* ... */);
```

#### Barrel Exports

```typescript
// components/ui/index.ts
export { Button, buttonVariants } from './button';
export { Input } from './input';
export { Card } from './card';
```

#### Default Exports

Use default exports for:

1. Main components in feature folders
2. Configuration objects
3. React components that are primarily used as default

```typescript
// features/auth/login-form.tsx
export default function LoginForm() {
  return <div>...</div>;
}

// lib/env.ts
export default env;
```

### Folder Organization

#### Feature-Based Structure

```
src/
features/
  auth/
    components/
      LoginForm.tsx
      RegisterForm.tsx
    hooks/
      useAuth.ts
    services/
      authService.ts
    types/
      auth-types.ts
    index.ts  // Barrel export
```

#### Component Structure

```
src/components/
ui/
  Button.tsx
  Input.tsx
  index.ts
forms/
  FormField.tsx
  FormValidation.tsx
  index.ts
layout/
  Header.tsx
  Sidebar.tsx
  index.ts
```

## Code Style Guidelines

### React Components

#### Functional Components

```typescript
// Use functional components with hooks
export function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useUser(userId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="user-profile">
      <h1>{user?.name}</h1>
      {/* component content */}
    </div>
  );
}

// Use React.forwardRef for components that need ref forwarding
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

#### Props Destructuring

```typescript
// Destructure props in function signature
export function Card({ children, className, variant }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)}>
      {children}
    </div>
  );
}

// For complex props, destructure in body
export function ComplexComponent(props: ComplexProps) {
  const { 
    user, 
    onUserSelect, 
    isLoading, 
    showActions = false 
  } = props;
  
  // implementation
}
```

### TypeScript Usage

#### Type Annotations

```typescript
// Always type function parameters
function processUser(user: User): ProcessedUser {
  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
  };
}

// Type return values for complex functions
async function fetchUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data;
}

// Use generic types where appropriate
function createApiService<T>(baseUrl: string): ApiService<T> {
  // implementation
}
```

#### Type Guards

```typescript
// Use type guards for runtime type checking
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'firstName' in obj &&
    'lastName' in obj
  );
}

// Use zod for schema validation
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

function validateUser(data: unknown): User {
  return userSchema.parse(data);
}
```

### Error Handling

#### Try-Catch Patterns

```typescript
// Use try-catch for async operations
async function handleSubmit(data: FormData) {
  try {
    await submitForm(data);
    addToast('Form submitted successfully', 'success');
  } catch (error) {
    if (error instanceof ApiError) {
      addToast(error.message, 'error');
    } else {
      addToast('An unexpected error occurred', 'error');
    }
  }
}

// Use error boundaries for component errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

#### Error Types

```typescript
// Create custom error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Use discriminated unions for error types
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

## Best Practices

### Performance

#### React Optimizations

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

#### Bundle Optimization

```typescript
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Dynamic imports for conditional features
if (featureEnabled) {
  const module = await import('./feature-module');
  module.setupFeature();
}
```

### Accessibility

#### Semantic HTML

```typescript
// Use semantic HTML elements
return (
  <main>
    <section aria-labelledby="profile-heading">
      <h2 id="profile-heading">User Profile</h2>
      {/* content */}
    </section>
  </main>
);

// Include ARIA attributes
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
>
  ×
</button>
```

#### Keyboard Navigation

```typescript
// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal();
  }
  if (event.key === 'Enter') {
    handleSubmit();
  }
};

// Include focus management
useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

### Testing

#### Test Naming

```typescript
// Test files use .test.ts or .spec.ts suffix
// useAuth.test.ts
// Button.test.tsx

// Test descriptions should be descriptive
describe('useAuth', () => {
  it('should return user data when authenticated', () => {
    // test implementation
  });

  it('should return null when not authenticated', () => {
    // test implementation
  });

  it('should handle login errors gracefully', () => {
    // test implementation
  });
});
```

#### Test Structure

```typescript
// Arrange, Act, Assert pattern
it('should login successfully with valid credentials', async () => {
  // Arrange
  const credentials = { email: 'test@example.com', password: 'password' };
  const mockUser = { id: '1', email: 'test@example.com' };
  
  // Act
  const result = await AuthService.login(credentials);
  
  // Assert
  expect(result.user).toEqual(mockUser);
  expect(localStorage.getItem('auth_token')).toBeTruthy();
});
```

## Git Conventions

### Commit Messages

Use conventional commit format:

```
type(scope): description

feat(auth): add login form component
fix(api): handle token refresh errors
docs(readme): update setup instructions
style(button): improve hover state
refactor(hooks): optimize useAuth hook
test(forms): add form validation tests
chore(deps): update react to v19
```

### Branch Naming

```
feature/login-form
bugfix/api-error-handling
hotfix/security-patch
refactor/component-structure
docs/update-documentation
```

These conventions ensure consistency, maintainability, and collaboration efficiency across the project.
