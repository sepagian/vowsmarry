import { ROUTES, AUTH_PAGES, PROTECTED_PREFIXES, PUBLIC_PREFIXES } from '$lib/constants/routes';

export class RouteMatcher {
	private static readonly ALWAYS_PUBLIC: readonly string[] = [ROUTES.STATIC.ROBOTS, ROUTES.STATIC.FAVICON];

	static isPublicAsset(pathname: string): boolean {
		return (
			PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
			this.ALWAYS_PUBLIC.includes(pathname)
		);
	}

	static isProtectedRoute(pathname: string): boolean {
		return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
	}

	static isAuthPage(pathname: string): boolean {
		return AUTH_PAGES.some((page) => pathname.startsWith(page));
	}
}
