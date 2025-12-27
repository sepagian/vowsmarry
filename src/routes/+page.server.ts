import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, activeWorkspaceId } = locals;

	if (!user) {
		throw redirect(302, '/login');
	}

	if (!activeWorkspaceId) {
		throw redirect(302, '/onboarding');
	}

	throw redirect(302, '/dashboard');
};
