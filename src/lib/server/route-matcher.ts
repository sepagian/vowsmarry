import { ROUTES, AUTH_PAGES, PROTECTED_PREFIXES, PUBLIC_PREFIXES } from '$lib/constants/routes';

/**
 * Route matching utility for authentication and authorization
 * 
 * Provides methods to determine route types and access control.
 * Used in hooks.server.ts to implement authentication middleware.
 * 
 * @example
 * ```typescript
 * if (RouteMatcher.isProtectedRoute(pathname)) {
 *   // Require authentication
 * }
 * ```
 */
export class RouteMatcher {
	private static readonly ALWAYS_PUBLIC: readonly string[] = [ROUTES.STATIC.ROBOTS, ROUTES.STATIC.FAVICON];

	/**
	 * Check if pathname is a public asset (CSS, JS, images, etc.)
	 * 
	 * @param pathname - Request pathname
	 * @returns true if pathname is a public asset
	 */
	static isPublicAsset(pathname: string): boolean {
		return (
			PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
			this.ALWAYS_PUBLIC.includes(pathname)
		);
	}

	/**
	 * Check if pathname requires authentication
	 * 
	 * @param pathname - Request pathname
	 * @returns true if pathname requires authentication
	 */
	static isProtectedRoute(pathname: string): boolean {
		return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
	}

	/**
	 * Check if pathname is an authentication page (login, register, etc.)
	 * 
	 * @param pathname - Request pathname
	 * @returns true if pathname is an auth page
	 */
	static isAuthPage(pathname: string): boolean {
		return AUTH_PAGES.some((page) => pathname.startsWith(page));
	}
}
