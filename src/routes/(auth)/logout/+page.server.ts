import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/login');
};

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (locals.session) {
			await invalidateSession(locals.session.id);
		}
		deleteSessionTokenCookie({ cookies } as any);
		throw redirect(302, '/login');
	}
};