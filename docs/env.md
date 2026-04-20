# Environment Variables

This document explains all environment variables used in the frontend boilerplate.

## Environment Setup

### 1. Copy Environment Template

First, copy the environment template:

```bash
cp .env.example .env
```

### 2. Configure Variables

Edit the `.env` file with your specific values.

## Available Environment Variables

### API Configuration

#### `VITE_API_BASE_URL`

**Description**: Base URL for all API requests

**Example**: `http://localhost:3000/api`

**Usage**:
```typescript
// src/lib/env.ts
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
};

// src/services/api.ts
const api = axios.create({
  baseURL: env.API_BASE_URL,
});
```

**Development**: `http://localhost:3000/api`
**Production**: `https://api.yourdomain.com`

### Authentication

#### `VITE_AUTH_TOKEN_KEY`

**Description**: localStorage key for storing access token

**Default**: `auth_token`

**Usage**:
```typescript
// src/services/api.ts
const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(env.AUTH_TOKEN_KEY);
  },
};
```

#### `VITE_REFRESH_TOKEN_KEY`

**Description**: localStorage key for storing refresh token

**Default**: `refresh_token`

**Usage**:
```typescript
// src/services/api.ts
const tokenStorage = {
  getRefreshToken: (): string | null => {
    return localStorage.getItem(env.REFRESH_TOKEN_KEY);
  },
};
```

### Application

#### `VITE_APP_NAME`

**Description**: Application name used in UI and documentation

**Default**: `Frontend Boilerplate`

**Usage**:
```typescript
// src/lib/env.ts
export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Frontend Boilerplate',
};
```

#### `VITE_APP_VERSION`

**Description**: Application version for debugging and caching

**Default**: `1.0.0`

**Usage**:
```typescript
// src/lib/env.ts
export const env = {
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};
```

### Development

#### `VITE_DEV_MODE`

**Description**: Enable development-specific features

**Default**: `true`

**Usage**:
```typescript
// src/lib/env.ts
export const env = {
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
};

// Conditional features
if (env.DEV_MODE) {
  console.log('Development mode enabled');
  // Enable dev tools, logging, etc.
}
```

## Environment Files

### `.env.example`

Template file with all available variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# Application
VITE_APP_NAME=Frontend Boilerplate
VITE_APP_VERSION=1.0.0

# Development
VITE_DEV_MODE=true
```

### `.env.local`

Local environment overrides (gitignored):

```env
# Local development overrides
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DEV_MODE=true
```

### `.env.production`

Production environment values:

```env
# Production configuration
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=My App
VITE_APP_VERSION=2.1.0
VITE_DEV_MODE=false
```

## Environment Access in Code

### Using `import.meta.env`

Vite provides environment variables through `import.meta.env`:

```typescript
// Access environment variable
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Check if variable exists
if (import.meta.env.VITE_API_BASE_URL) {
  // Variable is defined
}

// Default values
const appName = import.meta.env.VITE_APP_NAME || 'Default App Name';
```

### Environment Configuration

The boilerplate provides a centralized environment configuration:

```typescript
// src/lib/env.ts
export function validateEnv() {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_AUTH_TOKEN_KEY',
    'VITE_REFRESH_TOKEN_KEY',
    'VITE_APP_NAME',
    'VITE_APP_VERSION',
  ];

  const missing = required.filter(key => !(key in import.meta.env));
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  REFRESH_TOKEN_KEY: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Frontend Boilerplate',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
} as const;
```

## Best Practices

### 1. Variable Naming

- Use `VITE_` prefix for all variables exposed to the frontend
- Use descriptive names (e.g., `VITE_API_BASE_URL` instead of `VITE_API`)
- Use `UPPER_SNAKE_CASE` for consistency

### 2. Security

- **Never** store secrets in frontend environment variables
- Use backend services for sensitive data
- Validate environment variables on application start

### 3. Environment Separation

- Use different `.env` files for different environments
- Never commit `.env.local` to version control
- Use CI/CD environment variables for production

### 4. Type Safety

```typescript
// Define environment variable types
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Development vs Production

### Development Environment

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEV_MODE=true
VITE_APP_NAME=My App (Dev)
```

### Production Environment

```env
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
VITE_APP_NAME=My App
```

## Common Patterns

### Feature Flags

```typescript
// Enable/disable features based on environment
const features = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  debugMode: import.meta.env.VITE_DEV_MODE === 'true',
  betaFeatures: import.meta.env.VITE_BETA_FEATURES === 'true',
};
```

### API Configuration

```typescript
// Different API endpoints for different environments
const apiEndpoints = {
  base: import.meta.env.VITE_API_BASE_URL,
  auth: `${import.meta.env.VITE_API_BASE_URL}/auth`,
  users: `${import.meta.env.VITE_API_BASE_URL}/users`,
};
```

### Conditional Imports

```typescript
// Load different modules based on environment
let analytics: any;

if (import.meta.env.PROD) {
  analytics = await import('./analytics.prod');
} else {
  analytics = await import('./analytics.dev');
}
```

## Troubleshooting

### Variables Not Available

If environment variables are not available:

1. Ensure variables start with `VITE_`
2. Restart the development server after changing `.env` files
3. Check that `.env` file is in the project root
4. Verify variable names match exactly

### Build Issues

For production builds:

1. Ensure all required variables are set in production
2. Use environment-specific `.env` files
3. Validate environment variables in CI/CD pipeline

### Type Errors

Add TypeScript support for environment variables:

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

This environment configuration system provides flexibility for different deployment scenarios while maintaining security and type safety.
