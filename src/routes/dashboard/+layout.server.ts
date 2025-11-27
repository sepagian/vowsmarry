import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, plannerDb }) => {
	const { user } = locals;

	if (!user) {
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
			firstName: user.name || null,
			lastName: null,
		},
		wedding: userWedding || null,
		hasWeddingData: !!userWedding,
	};
};
