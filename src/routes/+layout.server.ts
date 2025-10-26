import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, cookies }) => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	return {
		user: error ? null : user,
		session: null, // Session not needed in client-side code
		cookies: cookies.getAll(),
	};
};
