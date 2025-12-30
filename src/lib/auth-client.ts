import { createAuthClient } from "better-auth/svelte";
import {
  organizationClient,
  inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import type { Auth } from "$lib/server/auth";

/**
 * Get the base URL for Better Auth client
 */
function getBaseURL(): string {
  // Use public env var (prefixed with PUBLIC_)
  if (env.PUBLIC_BETTER_AUTH_URL) {
    return env.PUBLIC_BETTER_AUTH_URL;
  }

  // Development default
  if (dev) {
    return "http://localhost:5173";
  }

  // Production: empty string tells Better Auth to use current origin
  return "";
}

/**
 * Better Auth client for Svelte
 *
 * This client provides authentication methods for the frontend:
 * - signIn: Authenticate users with email and password
 * - signUp: Register new users
 * - signOut: End user session
 * - useSession: Reactive session state hook
 *
 * Base URL configuration:
 * - Uses BETTER_AUTH_URL if provided in environment
 * - Falls back to localhost in development
 * - Uses current origin in production (empty string)
 *
 */
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields<Auth>(),
    }),
  ],
});

/**
 * Exported authentication methods from Better Auth Svelte client
 *
 * @property {Function} signIn - Sign in with email and password
 * @property {Function} signUp - Register a new user account
 * @property {Function} signOut - Sign out the current user
 * @property {Function} useSession - Hook to access current session state
 */
export const { signIn, signUp, signOut, useSession } = authClient;
