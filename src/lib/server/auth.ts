import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzle } from 'drizzle-orm/d1';

import { dev } from '$app/environment';
import { getRequestEvent } from '$app/server';

import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from '$env/static/private';

import { sendEmail } from '$lib/server/email';

import { SESSION_CONFIG, VALIDATION_CONFIG } from '$lib/constants/config';

import {
	account,
	accountRelations,
	invitation,
	invitationRelations,
	member,
	memberRelations,
	organizationRelations,
	organization as organizationTable,
	session,
	sessionRelations,
	userRelations,
	user as userTable,
	verification,
} from './db/schema/auth-schema';

// Validate environment variables at module load time
if (!BETTER_AUTH_SECRET) {
	throw new Error('BETTER_AUTH_SECRET environment variable is required');
}

if (!BETTER_AUTH_URL) {
	throw new Error('BETTER_AUTH_URL environment variable is required');
}

try {
	new URL(BETTER_AUTH_URL);
} catch {
	throw new Error(`BETTER_AUTH_URL must be a valid URL, got: ${BETTER_AUTH_URL}`);
}

if (BETTER_AUTH_SECRET.length < 32) {
	throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long for security');
}

/**
 * Creates a Better Auth instance for Cloudflare D1
 *
 * Standard Better Auth pattern adapted for Cloudflare Workers/Pages:
 * - In traditional setups, you create one auth instance at module level
 * - With Cloudflare D1, the database binding is per-request, so we use a factory function
 * - This function should be called in hooks.server.ts with the D1 binding from event.platform.env
 *
 * Configuration:
 * - Drizzle ORM adapter with SQLite provider for D1 compatibility
 * - Email/password authentication with configurable validation
 * - Session management with cookie caching for performance
 * - Organization plugin for multi-tenant wedding planning
 * - SvelteKit cookies plugin for proper cookie handling in server actions
 *
 * @param d1 - D1Database binding from event.platform.env in SvelteKit
 * @returns Configured Better Auth instance
 *
 * @example
 * ```ts
 * // In hooks.server.ts
 * const auth = getAuth(event.platform.env.vowsmarry);
 * const session = await auth.api.getSession({ headers: event.request.headers });
 * ```
 */
export function getAuth(d1: D1Database) {
	const schema = {
		user: userTable,
		session,
		account,
		verification,
		userRelations,
		sessionRelations,
		accountRelations,
		organization: organizationTable,
		member,
		invitation,
		organizationRelations,
		memberRelations,
		invitationRelations,
	};
	const db = drizzle(d1, { schema });

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: 'sqlite',
		}),

		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
			minPasswordLength: VALIDATION_CONFIG.MIN_PASSWORD_LENGTH,
			maxPasswordLength: VALIDATION_CONFIG.MAX_PASSWORD_LENGTH,
			sendResetPassword: async ({
				user,
				url,
				token,
			}: {
				user: { email: string; name: string | null };
				url: string;
				token: string;
			}) => {
				await sendEmail({
					type: 'password-reset',
					to: user.email,
					user: {
						name: user.name || undefined,
						email: user.email,
					},
					resetUrl: url,
					token,
				});
			},
		},

		emailVerification: {
			sendVerificationEmail: async ({
				user,
				url,
				token,
			}: {
				user: { email: string; name: string | null };
				url: string;
				token: string;
			}) => {
				await sendEmail({
					type: 'verification',
					to: user.email,
					user: {
						name: user.name || undefined,
						email: user.email,
					},
					verificationUrl: url,
					token,
				});
			},
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
		},

		session: {
			expiresIn: SESSION_CONFIG.MAX_AGE_SECONDS,
			updateAge: SESSION_CONFIG.UPDATE_INTERVAL_SECONDS,
			cookieCache: {
				enabled: false,
			},
		},

		secret: BETTER_AUTH_SECRET,
		baseURL: BETTER_AUTH_URL,

		advanced: {
			cookiePrefix: 'vowsmarry_auth',
			crossSubDomainCookies: {
				enabled: false,
			},
		},

		trustedOrigins: dev ? ['http://localhost:5173', 'http://localhost:4173'] : [BETTER_AUTH_URL],

		plugins: [
			organization({
				schema: {
					organization: {
						additionalFields: {
							groomName: {
								type: 'string',
								input: true,
								required: false,
							},
							brideName: {
								type: 'string',
								input: true,
								required: false,
							},
							weddingDate: {
								type: 'string',
								input: true,
								required: false,
							},
							weddingVenue: {
								type: 'string',
								input: true,
								required: false,
							},
							weddingBudget: {
								type: 'string',
								input: true,
								required: false,
							},
						},
					},
				},
			}),
			sveltekitCookies(getRequestEvent),
		],
	});
}

/**
 * Type helper for Better Auth instance
 * Use this type when you need to type the auth instance in your code
 */
export type Auth = ReturnType<typeof getAuth>;
