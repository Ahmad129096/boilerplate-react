/**
 * 404 Not Found route
 */

import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';

/**
 * Not found component
 */
export function NotFoundComponent() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

/**
 * Not found route
 */
export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundComponent,
});
