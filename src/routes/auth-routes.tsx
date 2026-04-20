/**
 * Authentication routes (public)
 */

import { createRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '../features/auth/login-form';
import { RegisterForm } from '../features/auth/register-form';
import { ForgotPasswordForm } from '../features/auth/forgot-password-form';
import { ResetPasswordForm } from '../features/auth/reset-password-form';
import { rootRoute } from './root-route';
import { AuthService } from '../services/auth';

/**
 * Login route
 */
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    // Redirect to dashboard if user is already logged in
    if (AuthService.isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: () => (
    <div className="max-w-md mx-auto">
      <LoginForm />
    </div>
  ),
});

/**
 * Register route
 */
export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: () => {
    // Redirect to dashboard if user is already logged in
    if (AuthService.isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: () => (
    <div className="max-w-md mx-auto">
      <RegisterForm />
    </div>
  ),
});

/**
 * Forgot password route
 */
export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  beforeLoad: () => {
    // Redirect to dashboard if user is already logged in
    if (AuthService.isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: () => (
    <div className="max-w-md mx-auto">
      <ForgotPasswordForm />
    </div>
  ),
});

/**
 * Reset password route
 */
export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: () => {
    // Get token from URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';

    if (!token) {
      return (
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Invalid Reset Link</h2>
          <p className="text-muted-foreground mb-4">
            This password reset link is invalid or has expired.
          </p>
          <a href="/forgot-password" className="text-primary hover:underline">
            Request a new reset link
          </a>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto">
        <ResetPasswordForm token={token} />
      </div>
    );
  },
});
