/**
 * Protected routes (require authentication)
 */

import { createRoute } from '@tanstack/react-router';
import { AuthService } from '../services/auth';
import { rootRoute } from './root-route';
import { Header } from '../components/header';

/**
 * Authentication check for protected routes
 */
function requireAuth() {
  if (!AuthService.isAuthenticated()) {
    throw new Error('Authentication required');
  }
}


/**
 * Dashboard route
 */
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => {
    requireAuth();

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            {/* Dashboard content will go here */}
          </div>
        </main>
      </div>
    );
  },
  beforeLoad: () => {
    requireAuth();
  },
});

/**
 * Profile route
 */
export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => {
    requireAuth();

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Profile</h2>
            <p>User profile will go here</p>
            {/* Profile content will go here */}
          </div>
        </main>
      </div>
    );
  },
  beforeLoad: () => {
    requireAuth();
  },
});
