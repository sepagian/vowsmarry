import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, plannerDb }) => {
	const { slug } = params;

	// Query organization table by slug
	const organization = await plannerDb
		.selectFrom('organization')
		.select([
			'id',
			'name',
			'slug',
			'groomName',
			'brideName',
			'weddingDate',
			'weddingVenue',
			'logo',
			'createdAt',
		])
		.where('slug', '=', slug)
		.executeTakeFirst();

	// If organization not found, return 404
	if (!organization) {
		throw error(404, {
			message: 'Wedding invitation not found',
			code: 'WEDDING_NOT_FOUND',
		});
	}

	// Return wedding information for display
	return {
		workspace: {
			id: organization.id,
			name: organization.name,
			slug: organization.slug,
			groomName: organization.groomName,
			brideName: organization.brideName,
			weddingDate: organization.weddingDate,
			weddingVenue: organization.weddingVenue,
			logo: organization.logo,
			createdAt: organization.createdAt,
		},
	};
};
