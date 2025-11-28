import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	// Better Auth session and user data are provided by the server layout
	// No need for client-side Supabase initialization
	return {
		session: data.session,
		user: data.user,
	};
};
