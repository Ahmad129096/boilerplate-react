/**
 * Main router configuration
 */

import { createRouter, createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { dashboardRoute, profileRoute } from './protected-routes';
import { loginRoute, registerRoute, forgotPasswordRoute, resetPasswordRoute } from './auth-routes';
import { notFoundRoute } from './not-found-route';
import { NotFoundComponent } from './not-found-route';
import { AuthService } from '../services/auth';

/**
 * Index route for root path redirect
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    // Check if user is authenticated
    if (AuthService.isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    } else {
      throw redirect({ to: '/login' });
    }
  },
});

/**
 * Create and configure router
 */
export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    dashboardRoute,
    profileRoute,
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    notFoundRoute,
  ]),
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundComponent,
});

/**
 * Register router for TypeScript
 */
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
