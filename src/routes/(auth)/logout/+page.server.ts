import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	redirect(302, '/login');
};

export const actions: Actions = {
	default: async () => {
		// Better Auth handles logout via client-side signOut() method
		// The client will call authClient.signOut() which invalidates the session
		// and clears cookies automatically
		
		// Redirect to login page
		redirect(302, '/login');
	},
};
