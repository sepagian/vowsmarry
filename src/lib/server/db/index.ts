import { CamelCasePlugin, Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

import type { Database } from './schema/types';

/**
 * WeakMap cache for Kysely instances
 * Uses WeakMap to allow garbage collection when D1Database binding is no longer referenced
 * This prevents memory leaks in serverless environments where module state persists
 */
const dbCache = new WeakMap<D1Database, Kysely<Database>>();

/**
 * Creates or retrieves a cached Kysely instance for the database
 * 
 * Uses WeakMap caching to:
 * - Avoid recreating Kysely instances on every request
 * - Allow garbage collection when D1Database is no longer referenced
 * - Prevent memory leaks in Cloudflare Workers environment
 * 
 * @param d1 - D1Database binding from platform.env
 * @returns Kysely instance with type-safe query builder
 */
export function getDb(d1: D1Database): Kysely<Database> {
	let db = dbCache.get(d1);
	
	if (!db) {
		db = new Kysely<Database>({
			dialect: new D1Dialect({ database: d1 }),
			plugins: [new CamelCasePlugin()],
		});
		dbCache.set(d1, db);
	}
	
	return db;
}
