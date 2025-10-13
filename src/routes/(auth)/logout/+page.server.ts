import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	redirect(302, '/login');
};

export const actions: Actions = {
	default: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();
		
		if (error) {
			console.error('Logout error:', error);
			// Even if logout fails, redirect to login for security
			redirect(302, '/login');
		}
		
		// Redirect to login with success message type
		redirect(302, '/login');
	},
};
