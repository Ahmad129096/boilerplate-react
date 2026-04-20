# Frontend Boilerplate Overview

## Project Purpose

This is a production-ready frontend boilerplate built with the latest stable React ecosystem. It provides a solid foundation for building modern web applications with best practices, scalability, and developer experience in mind.

## Tech Stack Explanation

### Core Technologies

- **React 19** - Latest version of React with concurrent features and improved performance
- **TypeScript** - Static typing for better code quality and developer experience
- **Vite** - Fast build tool and development server with HMR

### State Management & Data Fetching

- **TanStack Query** - Powerful data fetching and caching solution
- **TanStack Router** - Type-safe routing with built-in data loading
- **Zod** - Runtime type validation and schema definitions

### UI & Styling

- **shadcn/ui** - Beautiful, accessible component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful icon library

### Form Handling

- **React Hook Form** - Performant, flexible forms with easy validation
- **@hookform/resolvers** - Zod integration for form validation

### HTTP Client

- **Axios** - Promise-based HTTP client with interceptors for auth and error handling

### Developer Experience

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Error Boundaries** - Graceful error handling
- **Toast System** - User-friendly notifications

## Architecture Overview

The application follows a feature-based architecture with clear separation of concerns:

```
src/
app/          # Router configuration and routing logic
components/   # Reusable UI components
features/     # Feature-specific components and pages
hooks/        # Custom React hooks
lib/          # Utility functions and configurations
services/     # API services and HTTP clients
types/        # TypeScript type definitions
```

### Key Architectural Principles

1. **Feature-First Organization** - Code is organized by features rather than file types
2. **Type Safety** - Full TypeScript coverage with strict mode enabled
3. **Separation of Concerns** - Clear boundaries between UI, logic, and data layers
4. **Reusable Components** - UI components are built to be composable and reusable
5. **Error Handling** - Comprehensive error handling at all levels
6. **Performance** - Optimized for performance with lazy loading and caching

### Data Flow

1. **User Interaction** - Components handle user events
2. **Form Validation** - React Hook Form with Zod validation
3. **API Calls** - Services make HTTP requests via Axios
4. **State Management** - TanStack Query manages server state
5. **UI Updates** - Components re-render based on state changes

### Authentication Flow

1. **Login** - User credentials sent to auth service
2. **Token Storage** - JWT tokens stored in localStorage
3. **Request Interception** - Axios adds auth headers automatically
4. **Token Refresh** - Automatic token refresh on 401 errors
5. **Protected Routes** - Router guards prevent unauthorized access

This architecture ensures scalability, maintainability, and excellent developer experience while following React and TypeScript best practices.
