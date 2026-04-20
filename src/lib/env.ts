/**
 * Environment variables configuration
 */

/**
 * Validates that all required environment variables are set
 * @throws Error if any required environment variable is missing
 */
export function validateEnv() {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_AUTH_TOKEN_KEY',
    'VITE_REFRESH_TOKEN_KEY',
    'VITE_APP_NAME',
    'VITE_APP_VERSION',
  ];

  const missing = required.filter(key => !(key in import.meta.env));
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Application configuration from environment variables
 */
export const env = {
  /** API base URL */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  /** Authentication token storage key */
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  /** Refresh token storage key */
  REFRESH_TOKEN_KEY: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
  /** Application name */
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Frontend Boilerplate',
  /** Application version */
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  /** Development mode flag */
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
} as const;

// Validate environment variables in development
if (env.DEV_MODE) {
  validateEnv();
}
