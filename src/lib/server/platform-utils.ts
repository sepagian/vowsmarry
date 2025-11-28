import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/**
 * Ensures platform bindings are available
 * Throws an error if running in an environment without Cloudflare bindings
 *
 * @param event - SvelteKit request event
 * @returns Non-null platform object
 * @throws {error(500)} if platform bindings are not available
 */
export function requirePlatform(event: RequestEvent): NonNullable<RequestEvent['platform']> {
	if (!event.platform?.env) {
		throw error(500, 'Platform bindings not available. Ensure running with Cloudflare adapter.');
	}
	return event.platform;
}

/**
 * Ensures D1 database binding is available
 *
 * @param event - SvelteKit request event
 * @returns D1 database instance
 * @throws {error(500)} if D1 database is not configured
 */
export function requireD1(event: RequestEvent) {
	const platform = requirePlatform(event);
	if (!platform.env.vowsmarry) {
		throw error(500, 'D1 database not configured. Check wrangler.toml bindings.');
	}
	return platform.env.vowsmarry;
}

/**
 * Ensures R2 bucket binding is available
 *
 * @param event - SvelteKit request event
 * @returns R2 bucket instance
 * @throws {error(500)} if R2 bucket is not configured
 */
export function requireR2(event: RequestEvent) {
	const platform = requirePlatform(event);
	if (!platform.env.VOWSMARRY_BUCKET) {
		throw error(500, 'R2 bucket not configured. Check wrangler.toml bindings.');
	}
	return platform.env.VOWSMARRY_BUCKET;
}
