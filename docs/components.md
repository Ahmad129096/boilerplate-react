# Components Guide

This guide explains how to use shadcn/ui components and create reusable components in the boilerplate.

## shadcn/ui Overview

shadcn/ui is a collection of beautifully designed, accessible components built on Radix UI primitives. The boilerplate includes several essential components and patterns for building more.

## Available Components

### Button

The Button component supports multiple variants and sizes:

```typescript
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// As child component
<Button asChild>
  <a href="/login">Login</a>
</Button>
```

### Input

Input component with consistent styling:

```typescript
import { Input } from '@/components/ui/input';

// Basic usage
<Input placeholder="Enter your email" />

// With different types
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" />

// With additional props
<Input disabled placeholder="Disabled" />
<Input required placeholder="Required" />
```

### Toast

Toast notification system:

```typescript
import { useToast } from '@/components/ui/toaster';

function MyComponent() {
  const { addToast } = useToast();
  
  const showToast = () => {
    addToast('Success message!', 'success');
    addToast('Error message', 'error');
    addToast('Warning message', 'warning');
    addToast('Info message', 'info');
  };
  
  return <Button onClick={showToast}>Show Toast</Button>;
}
```

## Creating Reusable Components

### 1. Component Structure

Follow this structure for reusable components:

```typescript
// src/components/ui/my-component.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function MyComponent({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md' 
}: MyComponentProps) {
  return (
    <div className={cn(
      'base-classes',
      variant === 'secondary' && 'variant-classes',
      size === 'sm' && 'size-classes',
      className
    )}>
      {children}
    </div>
  );
}
```

### 2. Using Class Variance Authority

For components with multiple variants, use CVA:

```typescript
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'border-border shadow-lg',
        outlined: 'border-2 border-border',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className, 
  variant, 
  padding 
}: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)}>
      {children}
    </div>
  );
}
```

### 3. Compound Components

Create components that work together:

```typescript
// Alert component with sub-components
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        warning: 'border-yellow-500/50 text-yellow-800 dark:border-yellow-500 [&>svg]:text-yellow-800',
        success: 'border-green-500/50 text-green-800 dark:border-green-500 [&>svg]:text-green-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
```

## Form Components

### Form with Validation

Create form components using React Hook Form and Zod:

```typescript
// src/components/ui/form.tsx
import React from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { z } from 'zod';

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
}: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={error && 'border-destructive'}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}
```

### Usage in Forms

```typescript
// src/features/auth/login-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        form={form}
        name="email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        required
      />
      <FormField
        form={form}
        name="password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

## Layout Components

### Container

Responsive container component:

```typescript
// src/components/ui/container.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ 
  children, 
  className, 
  size = 'lg' 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}
```

### Grid System

Flexible grid component:

```typescript
// src/components/ui/grid.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
}

export function Grid({ 
  children, 
  className, 
  cols = 1, 
  gap = 'md' 
}: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}
```

## Loading Components

### Spinner

Loading spinner component:

```typescript
// src/components/ui/spinner.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}
```

### Loading State

Loading state wrapper:

```typescript
// src/components/ui/loading-state.tsx
import React from 'react';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function LoadingState({ 
  isLoading, 
  children, 
  fallback, 
  className 
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {fallback || <Spinner />}
      </div>
    );
  }

  return <>{children}</>;
}
```

## Best Practices

### 1. Component Design

- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Prefer composition patterns
- **Props Interface**: Always define props interfaces with TypeScript
- **Default Props**: Provide sensible defaults for optional props

### 2. Styling

- **Tailwind Classes**: Use utility classes for styling
- **CVA for Variants**: Use class-variance-authority for complex variants
- **Responsive Design**: Include responsive breakpoints in components
- **Dark Mode**: Support dark mode with CSS variables

### 3. Accessibility

- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Attributes**: Include ARIA labels and roles
- **Keyboard Navigation**: Ensure keyboard accessibility
- **Screen Readers**: Test with screen readers

### 4. Performance

- **React.memo**: Use for expensive components
- **useMemo/useCallback**: Optimize expensive operations
- **Code Splitting**: Lazy load large components
- **Bundle Size**: Keep component bundles small

### 5. Testing

- **Unit Tests**: Test component behavior
- **Integration Tests**: Test component interactions
- **Visual Testing**: Test component appearance
- **Accessibility Testing**: Test with accessibility tools

This component system provides a solid foundation for building consistent, accessible, and maintainable UI components.
