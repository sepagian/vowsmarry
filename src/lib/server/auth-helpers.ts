import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { User } from 'better-auth/types';
import type { Kysely } from 'kysely';
import type { Database } from '$lib/server/db/schema/types';
import type { AuthContext, Wedding } from './auth-types';
import { createAppError, ErrorCodes } from './error-utils';
import { isValidUser } from './auth-utils';

/**
 * Authentication Helper Functions
 *
 * This module provides utility functions for working with Better Auth authentication
 * in SvelteKit server-side code. These helpers simplify common authentication patterns
 * and ensure consistent error handling across the application.
 */

/**
 * Retrieves the wedding record for a given user ID
 *
 * This function queries the weddings table to find the wedding record associated
 * with a specific user. Each user can have one wedding record that contains their
 * wedding planning data.
 *
 * @param userId - Better Auth user ID (from user.id)
 * @param plannerDb - Kysely database instance (from event.plannerDb)
 * @returns Wedding record or undefined if not found
 *
 * @example
 * ```typescript
 * const wedding = await getWedding(user.id, plannerDb);
 * if (wedding) {
 *   console.log(`Wedding date: ${wedding.weddingDate}`);
 * }
 * ```
 */
export async function getWedding(
	userId: string,
	plannerDb: Kysely<Database>,
): Promise<Wedding | undefined> {
	return plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', userId)
		.executeTakeFirst();
}

/**
 * Retrieves the authenticated user from Better Auth locals
 *
 * This function validates that a user is authenticated by checking if the user
 * object exists in event.locals. Better Auth automatically populates event.locals.user
 * when a valid session exists. If the user is not authenticated, this function
 * throws a 401 Unauthorized error.
 *
 * Use this function in load functions and API endpoints to ensure authentication
 * before processing requests.
 *
 * @param user - Better Auth user from event.locals.user
 * @returns Authenticated user object
 * @throws {error(401)} if user is not authenticated (null or undefined)
 *
 * @example
 * ```typescript
 * // In a load function
 * export const load = async ({ locals }) => {
 *   const user = await getUser(locals.user);
 *   // user is guaranteed to exist here
 *   return { user };
 * };
 * ```
 */
export async function getUser(user: User | null): Promise<User> {
	if (!user || !isValidUser(user)) {
		throw error(401, createAppError(401, 'Authentication required', ErrorCodes.AUTH_REQUIRED));
	}
	return user;
}

/**
 * Higher-order function that wraps SvelteKit actions with authentication and authorization
 *
 * This function provides a convenient way to protect form actions and ensure that:
 * 1. The user is authenticated (has a valid session)
 * 2. The user has an associated wedding record
 * 3. The database connection is available
 *
 * The wrapped handler receives an AuthContext object containing the authenticated user,
 * their wedding data, and the database instance. This eliminates boilerplate code
 * for checking authentication and retrieving user data in every action.
 *
 * Error Handling:
 * - Throws 401 if user is not authenticated
 * - Throws 403 if user has no wedding record
 * - Throws 500 if database is not available
 *
 * @param handler - Action handler function that receives AuthContext and event
 * @returns SvelteKit action function
 *
 * @example
 * ```typescript
 * // In +page.server.ts
 * export const actions = {
 *   createTask: withAuth(async ({ user, wedding, plannerDb }, { request }) => {
 *     // user, wedding, and plannerDb are guaranteed to exist
 *     const formData = await request.formData();
 *     const title = formData.get('title') as string;
 *
 *     await plannerDb
 *       .insertInto('tasks')
 *       .values({
 *         weddingId: wedding.id,
 *         title,
 *         userId: user.id,
 *       })
 *       .execute();
 *
 *     return { success: true };
 *   }),
 *
 *   updateTask: withAuth(async ({ user, wedding, plannerDb }, { request }) => {
 *     // Another protected action
 *     // ...
 *   }),
 * };
 * ```
 *
 * @example
 * ```typescript
 * // In an API endpoint
 * export const POST = withAuth(async ({ user, wedding, plannerDb }, { request }) => {
 *   const data = await request.json();
 *
 *   // Process authenticated request
 *   // ...
 *
 *   return json({ success: true });
 * });
 * ```
 */
export function withAuth<T>(
	handler: (context: AuthContext, event: { request: Request }) => Promise<T>,
) {
	return async ({ request, locals, plannerDb }: RequestEvent) => {
		// Ensure database is available
		if (!plannerDb) {
			throw error(500, createAppError(500, 'Database error', ErrorCodes.DATABASE_ERROR));
		}

		// Validate user is authenticated (throws 401 if not)
		const user = await getUser(locals.user);

		// Retrieve user's wedding data
		const wedding = await getWedding(user.id, plannerDb);

		// Ensure user has wedding data (throws 403 if not)
		if (!wedding) {
			throw error(
				404,
				createAppError(
					404,
					'Wedding profile not found. Please complete your profile setup.',
					ErrorCodes.WEDDING_NOT_FOUND,
				),
			);
		}

		// Call the wrapped handler with guaranteed AuthContext
		return handler({ user, wedding, plannerDb }, { request });
	};
}
