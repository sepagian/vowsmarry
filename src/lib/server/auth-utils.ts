import type { Session, User } from 'better-auth/types';

/**
 * Type guard to validate Better Auth user has required fields
 */
export function isValidUser(user: User): user is User {
	return (
		typeof user === 'object' &&
		user !== null &&
		'id' in user &&
		'email' in user &&
		typeof user.id === 'string' &&
		typeof user.email === 'string'
	);
}

/**
 * Type guard to validate Better Auth session
 */
export function isValidSession(session: Session): session is Session {
	return (
		typeof session === 'object' &&
		session !== null &&
		'id' in session &&
		'userId' in session &&
		'expiresAt' in session &&
		typeof session.id === 'string' &&
		typeof session.userId === 'string'
	);
}

/**
 * Type guard to check if user is authenticated
 * Narrows the type to ensure session and user are non-null
 *
 * @param locals - App.Locals object from request event
 * @returns True if both session and user exist
 *
 * @example
 * ```typescript
 * if (isAuthenticated(event.locals)) {
 *   // event.locals.user is User (not null)
 *   console.log(event.locals.user.email);
 * }
 * ```
 */
export function isAuthenticated(
	locals: App.Locals,
): locals is App.Locals & { session: Session; user: User } {
	return locals.session !== null && locals.user !== null;
}

/**
 * Requires authentication, throwing an error if not authenticated
 * Useful for protecting server-side operations
 *
 * @param locals - App.Locals object from request event
 * @returns The authenticated user
 * @throws {Error} 401 if not authenticated
 *
 * @example
 * ```typescript
 * const user = requireAuth(event.locals);
 * // user is guaranteed to be non-null here
 * ```
 */
export function requireAuth(locals: App.Locals): User {
	if (!isAuthenticated(locals)) {
		throw new Error('Authentication required');
	}
	return locals.user;
}
