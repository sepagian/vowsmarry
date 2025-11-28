import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import type { Kysely } from 'kysely';
import type { Database } from '$lib/server/db/schema/types';
import type { Session, User } from 'better-auth/types';

declare global {
	namespace App {
		/**
		 * Custom error structure for consistent error handling.
		 * Used by SvelteKit's error() and fail() functions.
		 *
		 * @see {@link $lib/server/error-utils.ts} for error creation utilities
		 */
		interface Error {
			/** User-facing error message */
			message: string;
			/** Error code for client-side handling (e.g., 'AUTH_REQUIRED', 'VALIDATION_ERROR') */
			code?: string;
			/** HTTP status code */
			status?: number;
			/** ISO timestamp of error occurrence */
			timestamp?: string;
		}

		/**
		 * Server-side locals available in all request handlers.
		 * Populated by Better Auth handler in hooks.server.ts.
		 *
		 * @remarks
		 * This replaces the previous Supabase-based authentication.
		 * The session and user are set by the Better Auth SvelteKit handler
		 * which runs before the auth guard in the hooks sequence.
		 *
		 * @see {@link https://better-auth.com/docs/integrations/sveltekit}
		 * @see {@link $lib/server/auth-utils.ts} for authentication utilities
		 */
		interface Locals {
			/** Current Better Auth session, null if unauthenticated */
			session: Session | null;
			/** Current Better Auth user, null if unauthenticated */
			user: User | null;
		}

		/**
		 * Data passed from server load functions to pages.
		 * Session is included for client-side auth state.
		 *
		 * @remarks
		 * The session should be returned from +layout.server.ts to make it
		 * available to all pages via $page.data.session
		 */
		interface PageData {
			/** Current Better Auth session for client-side access */
			session: Session | null;
		}

		// interface PageState {}

		/**
		 * Cloudflare-specific platform bindings.
		 * Available via event.platform in server code.
		 *
		 * @remarks
		 * These bindings are only available when running with the Cloudflare adapter.
		 * Use platform-utils.ts helpers to safely access these bindings.
		 *
		 * @see {@link $lib/server/platform-utils.ts}
		 */
		interface Platform {
			env: {
				/** Cloudflare D1 database instance for wedding planner data */
				vowsmarry: D1Database;
				/** Cloudflare R2 bucket for file storage (documents, images) */
				VOWSMARRY_BUCKET?: R2Bucket;
			};
			context: {
				/** Extend the request lifetime for background tasks */
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

/**
 * Extend SvelteKit's RequestEvent with database instances.
 * Populated by database handler in hooks.server.ts.
 *
 * @remarks
 * Both plannerDb and invitationDb currently point to the same D1 database instance.
 * They are separated for potential future database splitting.
 */
declare module '@sveltejs/kit' {
	interface RequestEvent {
		/** Kysely instance for wedding planner database operations */
		plannerDb: Kysely<Database>;
		/** Kysely instance for invitation database operations (same D1 instance) */
		invitationDb: Kysely<Database>;
	}
}

export {};
