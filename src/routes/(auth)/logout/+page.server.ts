import { redirect, fail } from '@sveltejs/kit';
import { getAuth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform?.env?.vowsmarry) {
		throw redirect(302, '/login');
	}

	const auth = getAuth(platform.env.vowsmarry);

	try {
		// Sign out the user
		await auth.api.signOut({
			headers: new Headers(),
		});
	} catch (error) {
		console.error('Logout error:', error);
	}

	// Always redirect to login after logout attempt
	throw redirect(302, '/login');
};

export const actions: Actions = {
	default: async ({ platform, request }) => {
		if (!platform?.env?.vowsmarry) {
			return fail(500, {
				error: 'Database configuration error',
			});
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Sign out the user
			await auth.api.signOut({
				headers: request.headers,
			});
		} catch (error) {
			console.error('Logout error:', error);
		}

		// Redirect to login page after logout
		throw redirect(302, '/login');
	},
};
