# Frontend Boilerplate

A production-ready frontend boilerplate built with the latest stable React ecosystem. This boilerplate provides a solid foundation for building modern web applications with best practices, scalability, and excellent developer experience.

## Tech Stack

- **React 19** - Latest version with concurrent features
- **TypeScript** - Static typing for better code quality
- **Vite** - Fast build tool and development server
- **TanStack Query** - Powerful data fetching and caching
- **TanStack Router** - Type-safe routing with data loading
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with validation
- **Zod** - Runtime type validation
- **Axios** - HTTP client with interceptors

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-boilerplate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_AUTH_TOKEN_KEY=auth_token
   VITE_REFRESH_TOKEN_KEY=refresh_token
   VITE_APP_NAME=Frontend Boilerplate
   VITE_APP_VERSION=1.0.0
   VITE_DEV_MODE=true
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Project Structure

```
src/
app/                  # Router configuration
components/           # Reusable UI components
  ui/                # Basic UI components (Button, Input, etc.)
features/            # Feature-specific components
  auth/              # Authentication components
  dashboard/         # Dashboard components
  profile/           # User profile components
hooks/               # Custom React hooks
lib/                 # Utilities and configurations
services/            # API services
types/               # TypeScript type definitions
```

## Key Features

### Authentication System

- JWT-based authentication with automatic token refresh
- Protected routes with route guards
- Login, signup, forgot password, and reset password flows
- Token storage and management

### Data Management

- TanStack Query for server state management
- Automatic caching and background refetching
- Optimistic updates and error handling
- Query invalidation and prefetching

### Form Handling

- React Hook Form with Zod validation
- Type-safe form schemas
- Error handling and submission states
- Reusable form components

### UI Components

- shadcn/ui component library
- Consistent design system
- Dark mode support
- Responsive design

### Developer Experience

- TypeScript with strict mode
- ESLint and Prettier configuration
- Error boundaries for graceful error handling
- Toast notification system
- Hot module replacement

## Environment Setup

### Development

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEV_MODE=true
```

### Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
```

See [Environment Variables Documentation](docs/env.md) for complete configuration options.

## API Integration

The boilerplate includes a configured Axios instance with:

- Automatic authentication headers
- Token refresh on 401 errors
- Error handling and retry logic
- Request/response interceptors

Example API service:

```typescript
// src/services/users.ts
export class UsersService {
  static async getUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  }
}
```

See [API Integration Guide](docs/api-integration.md) for detailed instructions.

## Authentication

The authentication system includes:

- Login and signup flows
- Automatic token refresh
- Protected routes
- User state management

Example usage:

```typescript
// In components
const { user, isAuthenticated, login, logout } = useAuth();

// Login
await login.mutateAsync({ email, password });

// Logout
await logout.mutateAsync();
```

See [Authentication Flow Documentation](docs/auth-flow.md) for complete details.

## Components

### Using shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Input placeholder="Enter text" />
    </div>
  );
}
```

### Creating Custom Components

```typescript
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(/* ... */);

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({ children, variant }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }))}>
      {children}
    </div>
  );
}
```

See [Components Guide](docs/components.md) for more information.

## Routing

The boilerplate uses TanStack Router for type-safe routing:

```typescript
// Protected route
const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'dashboard',
  component: DashboardComponent,
  beforeLoad: () => {
    requireAuth(); // Authentication check
  },
});
```

## State Management

### Server State with TanStack Query

```typescript
// Query hook
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => UsersService.getUsers(),
  });
}

// Mutation hook
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => UsersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Local State with React Hooks

```typescript
// Custom hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Initialize from localStorage
  });
  
  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}
```

## Styling

### Tailwind CSS

The boilerplate uses Tailwind CSS with a custom design system:

```typescript
// Custom theme variables
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96%;
```

### Dark Mode

Components automatically support dark mode through CSS variables:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

## Testing

The boilerplate is set up for testing with:

- Unit tests for components and hooks
- Integration tests for user flows
- Mock services for API testing

Example test:

```typescript
test('should login successfully', async () => {
  const { result } = renderHook(() => useLogin());
  
  await act(async () => {
    await result.current.mutateAsync({ email: 'test@example.com', password: 'password' });
  });
  
  expect(result.current.isSuccess).toBe(true);
});
```

## Deployment

### Build for Production

```bash
pnpm build
```

The build output will be in the `dist/` directory.

### Environment Variables

Ensure all required environment variables are set in production:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Your App Name
VITE_DEV_MODE=false
```

### Static Hosting

The build can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## How to Extend

### Adding New Features

1. **Create feature folder**: `src/features/new-feature/`
2. **Add components**: Create feature-specific components
3. **Add hooks**: Create custom hooks if needed
4. **Add services**: Create API service classes
5. **Add types**: Define TypeScript interfaces
6. **Add routes**: Configure routing in `src/app/router.tsx`

### Adding New Components

1. **Create component**: `src/components/ui/new-component.tsx`
2. **Define props interface**: Use TypeScript for type safety
3. **Add variants**: Use class-variance-authority if needed
4. **Export**: Add to `src/components/ui/index.ts`
5. **Document**: Add JSDoc comments

### Adding New API Endpoints

1. **Define types**: Add interfaces in `src/types/`
2. **Create service**: Add methods to service classes
3. **Add hooks**: Create query and mutation hooks
4. **Add query keys**: Update `src/lib/query-client.ts`
5. **Handle errors**: Implement proper error handling

## Documentation

- [Overview](docs/overview.md) - Project overview and architecture
- [Folder Structure](docs/folder-structure.md) - Directory structure explanation
- [API Integration](docs/api-integration.md) - API usage guidelines
- [Authentication Flow](docs/auth-flow.md) - Authentication implementation
- [Components](docs/components.md) - Component usage patterns
- [Environment Variables](docs/env.md) - Environment configuration
- [Conventions](docs/conventions.md) - Coding conventions and best practices

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'feat: add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:

- Read the documentation in the `/docs` folder
- Check the [GitHub Issues](https://github.com/your-username/frontend-boilerplate/issues)
- Refer to the official documentation of the technologies used

---

Built with React 19, TypeScript, and modern web development best practices.
