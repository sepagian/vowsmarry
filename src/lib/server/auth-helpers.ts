import type { RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import type { Kysely } from 'kysely';
import type { Database } from '$lib/server/db/schema/types';

/**
 * Retrieves the wedding record for a given user ID
 */
export async function getWedding(userId: string, plannerDb: Kysely<Database>) {
	return plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', userId)
		.executeTakeFirst();
}

/**
 * Retrieves the authenticated user from Supabase
 * @throws {fail(401)} if user is not authenticated
 */
export async function getUser(supabase: {
	auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
}) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw fail(401, { error: 'Unauthorized' });
	return user;
}

/**
 * Context provided to authenticated action handlers
 */
export type AuthContext = {
	user: { id: string };
	wedding: NonNullable<Awaited<ReturnType<typeof getWedding>>>;
	plannerDb: Kysely<Database>;
};

/**
 * Higher-order function that wraps SvelteKit actions with authentication and authorization.
 * Automatically retrieves the user and their wedding data, returning 401/403 errors if needed.
 *
 * @example
 * ```typescript
 * export const actions = {
 *   updateData: withAuth(async ({ user, wedding, plannerDb }, { request }) => {
 *     // user and wedding are guaranteed to exist here
 *     // ... your action logic
 *   })
 * };
 * ```
 */
export function withAuth<T>(
	handler: (context: AuthContext, event: { request: Request }) => Promise<T>
) {
	return async ({ request, locals: { supabase }, plannerDb }: RequestEvent) => {
		const user = await getUser(supabase);
		const wedding = await getWedding(user.id, plannerDb);
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		return handler({ user, wedding, plannerDb }, { request });
	};
}
