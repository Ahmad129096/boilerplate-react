/**
 * Root route configuration
 */

import { createRootRoute, Outlet } from '@tanstack/react-router';

/**
 * Root component
 */
function RootComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

/**
 * Root route
 */
export const rootRoute = createRootRoute({
  component: RootComponent,
});
