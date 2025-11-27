import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Database } from './schema/types';

let cachedDb: Kysely<Database> | null = null;

/**
 * Creates a Kysely instance for the database
 * @param d1 - D1Database binding from platform.env
 * @returns Kysely instance with type-safe query builder
 */
export function getDb(d1: D1Database): Kysely<Database> {
	if (cachedDb) {
		return cachedDb;
	}

	const db = new Kysely<Database>({
		dialect: new D1Dialect({ database: d1 }),
	});

	cachedDb = db;
	return db;
}
