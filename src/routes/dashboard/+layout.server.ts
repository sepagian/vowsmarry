import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, plannerDb }) => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	const userWedding = await plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', user.id)
		.executeTakeFirst();

	return {
		user: {
			id: user.id,
			email: user.email,
			firstName: user.user_metadata?.first_name,
			lastName: user.user_metadata?.last_name,
		},
		wedding: userWedding || null,
		hasWeddingData: !!userWedding,
	};
};
