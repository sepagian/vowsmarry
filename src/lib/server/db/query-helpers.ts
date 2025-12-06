import type { Kysely } from 'kysely';
import type { Database } from './schema/types';

/**
 * Get count of records in a table for a specific organization
 */
export async function getTableCount(
	db: Kysely<Database>,
	table: 'tasks' | 'expense_items' | 'documents' | 'vendors',
	organizationId: string,
): Promise<number> {
	const result = await db
		.selectFrom(table)
		.select((eb) => eb.fn.countAll<number>().as('count'))
		.where('organizationId', '=', organizationId)
		.executeTakeFirst();

	return result?.count ?? 0;
}

/**
 * Get the most recent update timestamp for a table
 * Returns timestamp as number (milliseconds since epoch) or null
 */
export async function getLastUpdate(
	db: Kysely<Database>,
	table: 'tasks' | 'expense_items' | 'documents' | 'vendors',
	organizationId: string,
): Promise<number | null> {
	const result = await db
		.selectFrom(table)
		.select('updatedAt')
		.where('organizationId', '=', organizationId)
		.orderBy('updatedAt', 'desc')
		.limit(1)
		.executeTakeFirst();

	if (!result?.updatedAt) return null;

	// Convert to number if it's a Date object
	const timestamp = result.updatedAt;
	return typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
}
