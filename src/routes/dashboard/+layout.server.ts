import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, activeWorkspace } = locals;

	if (!user) {
		redirect(302, '/login');
	}

	if (!activeWorkspace) {
		redirect(302, '/onboarding');
	}

	return {
		user: {
			id: user.id,
			email: user.email,
			firstName: user.name || null,
			lastName: null,
		},
		// Active workspace (organization) data
		workspace: {
			id: activeWorkspace.id,
			name: activeWorkspace.name,
			slug: activeWorkspace.slug,
			groomName: activeWorkspace.groomName || null,
			brideName: activeWorkspace.brideName || null,
			weddingDate: activeWorkspace.weddingDate || null,
			weddingVenue: activeWorkspace.weddingVenue || null,
			weddingBudget: activeWorkspace.weddingBudget ? parseFloat(activeWorkspace.weddingBudget) : null,
		},
		hasWeddingData: true,
	};
};
