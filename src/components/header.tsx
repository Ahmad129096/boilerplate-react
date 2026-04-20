/**
 * Header component with navigation and logout
 */

import React from 'react';
import { useLogout } from '../hooks/use-auth';
import { Button } from './ui/button';
import { Link } from '@tanstack/react-router';
import { useToast } from './ui/toaster';

/**
 * Header component
 */
export function Header() {
  const logout = useLogout();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      addToast('Logged out successfully', 'success');
      // Redirect will be handled by the logout hook
    } catch (error: any) {
      addToast(error.message || 'Logout failed', 'error');
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Frontend Boilerplate</h1>
            <nav className="flex space-x-6">
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={logout.isPending}
          >
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </header>
  );
}
