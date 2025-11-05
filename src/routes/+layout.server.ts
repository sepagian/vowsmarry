import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { supabase }, cookies }) => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName: user.user_metadata?.first_name || '',
			lastName: user.user_metadata?.last_name || '',
		},
		session: null, // Session not needed in client-side code
		cookies: cookies.getAll(),
	};
};
