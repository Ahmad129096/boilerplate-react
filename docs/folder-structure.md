# Folder Structure

This document explains the purpose and responsibility of each folder in the project.

## Root Directory Structure

```
frontend-boilerplate/
docs/                 # Documentation files
public/               # Static assets (favicon, icons, etc.)
src/                  # Source code
.env.example          # Environment variables template
.gitignore            # Git ignore rules
README.md             # Project documentation
components.json       # shadcn/ui configuration
eslint.config.js      # ESLint configuration
index.html            # HTML entry point
package.json          # Dependencies and scripts
pnpm-lock.yaml        # Dependency lock file
postcss.config.js     # PostCSS configuration
tailwind.config.js    # Tailwind CSS configuration
tsconfig.json         # TypeScript configuration
vite.config.ts        # Vite build configuration
```

## Source Code Structure (`src/`)

### `app/`
**Purpose**: Application routing and global app configuration

**Contents**:
- `router.tsx` - TanStack Router configuration with protected routes
- `auth-provider.tsx` - Authentication context and provider

**Responsibility**:
- Define application routes and navigation
- Implement route guards and authentication checks
- Configure router behavior and data loading

### `components/`
**Purpose**: Reusable UI components organized by category

**Structure**:
```
components/
ui/                  # Basic UI components (Button, Input, etc.)
error-boundary.tsx   # Error boundary component
```

**Responsibility**:
- Provide reusable, composable UI components
- Implement design system and styling patterns
- Handle component-level state and interactions

### `features/`
**Purpose**: Feature-specific components and pages

**Structure**:
```
features/
auth/                # Authentication related components
  login-form.tsx
  register-form.tsx
  forgot-password-form.tsx
dashboard/           # Dashboard feature components
profile/             # User profile feature components
```

**Responsibility**:
- Organize code by feature rather than file type
- Contain feature-specific business logic
- Implement complete user workflows

### `hooks/`
**Purpose**: Custom React hooks for shared logic

**Contents**:
- `use-auth.ts` - Authentication state and operations
- Additional custom hooks as needed

**Responsibility**:
- Extract reusable component logic
- Provide clean APIs for complex operations
- Manage side effects and subscriptions

### `lib/`
**Purpose**: Utility functions and configurations

**Contents**:
- `utils.ts` - General utility functions
- `env.ts` - Environment variable configuration
- `query-client.ts` - TanStack Query configuration

**Responsibility**:
- Provide helper functions and utilities
- Configure third-party libraries
- Define constants and configuration objects

### `services/`
**Purpose**: API services and HTTP client configuration

**Contents**:
- `api.ts` - Axios configuration with interceptors
- `auth.ts` - Authentication API service

**Responsibility**:
- Handle HTTP requests and responses
- Implement API client configuration
- Define service interfaces and error handling

### `types/`
**Purpose**: TypeScript type definitions

**Contents**:
- `index.ts` - Global type definitions

**Responsibility**:
- Define interfaces and types used across the application
- Ensure type safety and developer experience
- Document data structures and API contracts

## Documentation (`docs/`)

**Purpose**: Comprehensive project documentation

**Contents**:
- `overview.md` - Project overview and architecture
- `folder-structure.md` - This file
- `api-integration.md` - API usage guidelines
- `auth-flow.md` - Authentication implementation
- `components.md` - Component usage patterns
- `env.md` - Environment variables
- `conventions.md` - Coding conventions and best practices

## Static Assets (`public/`)

**Purpose**: Static files served directly

**Contents**:
- `favicon.svg` - Application favicon
- `icons.svg` - Icon sprites and SVG assets

## Configuration Files

### `package.json`
- Dependencies and scripts
- Project metadata and configuration

### `tsconfig.json` & `tsconfig.app.json`
- TypeScript compiler options
- Path mappings and module resolution

### `vite.config.ts`
- Build tool configuration
- Development server settings
- Plugin configuration

### `tailwind.config.js`
- Tailwind CSS configuration
- Custom theme and design tokens

### `eslint.config.js`
- Code linting rules
- TypeScript integration

## Best Practices

1. **Feature-First Organization**: Group related files by feature
2. **Clear Separation**: Keep UI, logic, and data layers separate
3. **Consistent Naming**: Use descriptive, consistent naming conventions
4. **Type Safety**: Define types for all data structures
5. **Documentation**: Document complex logic and public APIs
6. **Reusability**: Build components to be composable and reusable

This structure ensures scalability, maintainability, and excellent developer experience while following modern React and TypeScript best practices.
