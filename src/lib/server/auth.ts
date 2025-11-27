import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema/auth-schema';
import { dev } from '$app/environment';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from '$env/static/private';

if (!BETTER_AUTH_SECRET) {
	throw new Error('BETTER_AUTH_SECRET environment variable is required');
}

if (!BETTER_AUTH_URL) {
	throw new Error('BETTER_AUTH_URL environment variable is required');
}

// URL Validation
try {
	new URL(BETTER_AUTH_URL);
} catch {
	throw new Error(`BETTER_AUTH_URL must be a valid URL, got: ${BETTER_AUTH_URL}`);
}

if (BETTER_AUTH_SECRET.length < 32) {
	throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long for security');
}

/**
 * Session duration constants (in seconds)
 *
 * @remarks
 * - SEVEN_DAYS: Maximum session lifetime before re-authentication required
 * - ONE_DAY: Frequency of session token rotation for security
 * - FIVE_MINUTES: Cookie cache duration to reduce database queries
 */
const SESSION_DURATION = {
	/** Maximum session lifetime: 7 days */
	MAX_AGE: 60 * 60 * 24 * 7,
	/** Session update frequency: 1 day */
	UPDATE_INTERVAL: 60 * 60 * 24,
	/** Cookie cache duration: 5 minutes */
	CACHE_TTL: 60 * 5,
} as const;

/**
 * Creates Better Auth configuration with Drizzle adapter for Cloudflare D1
 * 
 * This function creates a Better Auth instance with:
 * - Drizzle ORM adapter with D1 driver for Cloudflare D1 compatibility
 * - Email and password authentication
 * - Secure cookie options with httpOnly, secure (in production), and sameSite
 * - Session management with 7-day expiration
 * 
 * @param d1 - D1Database binding from Cloudflare Workers/Pages platform
 * @returns Better Auth instance configured for the request
 */
function createAuth(d1: D1Database) {
	// Create Drizzle instance with D1 driver
	const db = drizzle(d1, { schema });

	const config: BetterAuthOptions = {
		database: drizzleAdapter(db, {
			provider: 'sqlite',
		}),

		// Email and password authentication configuration
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false, // Set to true when email service is configured
			minPasswordLength: 8,
			maxPasswordLength: 128,
		},

		// Session configuration
		session: {
			expiresIn: SESSION_DURATION.MAX_AGE,
			updateAge: SESSION_DURATION.UPDATE_INTERVAL,
			cookieCache: {
				enabled: true,
				maxAge: SESSION_DURATION.CACHE_TTL,
			},
		},

		// Security and cookie configuration
		secret: BETTER_AUTH_SECRET,
		baseURL: BETTER_AUTH_URL,

		advanced: {
			cookiePrefix: 'vowsmarry_auth',

			// Secure cookie options
			// - httpOnly: true (prevents JavaScript access to cookies)
			// - secure: true in production (requires HTTPS)
			// - sameSite: 'lax' (CSRF protection while allowing normal navigation)
			useSecureCookies: !dev, // Enable secure flag in production only

			crossSubDomainCookies: {
				enabled: false,
			},

			// Additional security: sameSite is set to 'lax' by default in Better Auth
			// This provides CSRF protection while allowing cookies on normal navigation
		},

		// Trusted origins for CORS
		trustedOrigins: dev ? ['http://localhost:5173', 'http://localhost:4173'] : [], // Add production domains when deploying

		// Plugins - sveltekitCookies must be last to properly handle cookies in server actions
		plugins: [sveltekitCookies(getRequestEvent)],
	};

	return betterAuth(config);
}

// Cache for auth instances per D1 database
const authCache = new WeakMap<D1Database, ReturnType<typeof betterAuth>>();

/**
 * Get or create Better Auth instance for the given D1 database
 * 
 * This function caches auth instances per D1 database to avoid recreating
 * the auth configuration on every request.
 * 
 * @param d1 - D1Database binding from Cloudflare Workers/Pages platform
 * @returns Better Auth instance
 */
export function getAuth(d1: D1Database) {
	let auth = authCache.get(d1);
	
	if (!auth) {
		auth = createAuth(d1);
		authCache.set(d1, auth);
	}
	
	return auth;
}

// For backwards compatibility, export a default auth instance
// This will be replaced with getAuth() in hooks.server.ts
export const auth = {
	api: {} as unknown,
} as ReturnType<typeof betterAuth>;
