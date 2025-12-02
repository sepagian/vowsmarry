import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, plannerDb }) => {
	const { user } = locals;

	if (!user) {
		throw redirect(302, '/login');
	}

	const userWedding = await plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', user.id)
		.executeTakeFirst();

	if (!userWedding) {
		throw redirect(302, '/onboarding');
	}

	throw redirect(302, '/dashboard');
};
