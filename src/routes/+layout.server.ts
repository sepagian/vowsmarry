import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { weddings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, cookies }) => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	// Check if user has wedding data
	const userWedding = await db.query.weddings.findFirst({
		where: eq(weddings.userId, user.id),
	});

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName: user.user_metadata?.first_name || '',
			lastName: user.user_metadata?.last_name || '',
		},
		wedding: userWedding || null,
		hasWeddingData: !!userWedding,
		session: null, // Session not needed in client-side code
		cookies: cookies.getAll(),
	};
};
