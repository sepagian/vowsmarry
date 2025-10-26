import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { weddings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	const userWedding = await db.query.weddings.findFirst({
		where: eq(weddings.userId, user.id),
	});

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
