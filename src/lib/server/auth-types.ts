import type { User as BetterAuthUser, Session as BetterAuthSession } from 'better-auth/types';
import type { Kysely, Selectable } from 'kysely';
import type { Database, WeddingsTable } from '$lib/server/db/schema/types';

/**
 * Better Auth user type
 * Re-exported for consistency across the application
 */
export type AuthUser = BetterAuthUser;

/**
 * Better Auth session type
 * Re-exported for consistency across the application
 */
export type AuthSession = BetterAuthSession;

/**
 * Wedding record type inferred from database query
 * Represents a user's wedding planning data
 */
export type Wedding = Selectable<WeddingsTable>;

/**
 * Context provided to authenticated action handlers via withAuth wrapper
 * Contains all necessary data for authenticated operations
 */
export type AuthContext = {
	/** Authenticated Better Auth user */
	user: AuthUser;
	/** User's wedding record */
	wedding: Wedding;
	/** Kysely database instance for planner operations */
	plannerDb: Kysely<Database>;
};
