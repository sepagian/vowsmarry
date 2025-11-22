import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Database } from './schema/types';

/**
 * Creates a Kysely instance for the database
 * @param d1 - D1Database binding from platform.env
 * @returns Kysely instance with type-safe query builder
 */
export function getDb(d1: D1Database): Kysely<Database> {
	return new Kysely<Database>({
		dialect: new D1Dialect({ database: d1 }),
	});
}
