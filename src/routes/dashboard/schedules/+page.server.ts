import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { plannerDb } from '$lib/server/db';
import { rundowns, weddings } from '$lib/server/db/schema/planner';
import { eq, count, and, sql } from 'drizzle-orm';
import type { RundownCategory } from '$lib/types';

import { scheduleEventFormSchema } from '$lib/validation/index';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
	depends('rundown:list');
	const scheduleForm = await superValidate(zod4(scheduleEventFormSchema as any));

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect(302, '/login');
	}

	const wedding = await plannerDb.query.weddings.findFirst({
		where: eq(weddings.userId, user.id),
	});

	if (!wedding) {
		return {
			scheduleForm,
			rundowns: [],
			stats: {
				totalEvents: 0,
				completedEvents: 0,
				remainingEvents: 0,
				nextEvent: null,
			},
			wedding: null,
			update: {},
		};
	}

	const [rundownList, completedEventsCount, nextEvent, totalEvents] = await Promise.all([
		plannerDb.query.rundowns.findMany({
			where: eq(rundowns.weddingId, wedding.id),
			orderBy: (rundowns, { asc }) => [asc(rundowns.startTime)],
		}),

		plannerDb
			.select({ count: count() })
			.from(rundowns)
			.where(and(eq(rundowns.weddingId, wedding.id), sql`${rundowns.endTime} < CURRENT_TIME`))
			.then((result) => result[0]?.count ?? 0),

		plannerDb.query.rundowns.findFirst({
			where: and(eq(rundowns.weddingId, wedding.id), sql`${rundowns.startTime} > CURRENT_TIME`),
			orderBy: (rundowns, { asc }) => [asc(rundowns.startTime)],
		}),

		plannerDb
			.select({ count: count() })
			.from(rundowns)
			.where(eq(rundowns.weddingId, wedding.id))
			.then((result) => result[0]?.count ?? 0),
	]);

	const remainingEventsCount = totalEvents - completedEventsCount;

	return {
		scheduleForm,
		rundowns: rundownList,
		stats: {
			totalEvents,
			completedEvents: completedEventsCount,
			remainingEvents: remainingEventsCount,
			nextEvent: nextEvent
				? {
						name: nextEvent.rundownName,
						startTime: nextEvent.startTime,
					}
				: null,
		},
		wedding,
		update: {},
	};
};

export const actions: Actions = {
	createRundown: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, zod4(scheduleEventFormSchema as any));
		if (!form.valid) return fail(400, { form });

		const formData = form.data as any;
		const rundownName = formData.title;
		const rundownType = formData.category;
		const { startTime, endTime, location, attendees } = formData;
		const venue = formData.location || '';
		const isPublic = formData.isPublic ?? false;

		try {
			const newRundown = await plannerDb
				.insert(rundowns)
				.values({
					weddingId: wedding.id,
					rundownName,
					rundownType,
					startTime,
					endTime,
					location: location || '',
					venue,
					attendees: attendees || '',
					isPublic,
				})
				.returning();

			return { form, success: true, rundown: newRundown[0] };
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to add new rundown. Please try again.',
			});
		}
	},
	editRundown: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const rundownId = data.get('id') as string;
		const rundownName = data.get('name') as string;
		const rundownType = data.get('category') as RundownCategory;
		const startTime = data.get('startTime') as string;
		const endTime = data.get('endTime') as string;
		const location = data.get('location') as string;
		const venue = data.get('venue') as string;
		const attendees = data.get('attendees') as string;
		const isPublicValue = data.get('isPublic');
		const isPublic = isPublicValue === 'true';

		try {
			const updatedRundown = await plannerDb
				.update(rundowns)
				.set({
					rundownName: rundownName as string,
					rundownType: rundownType as RundownCategory,
					startTime: startTime as string,
					endTime: endTime as string,
					location: location as string,
					venue: venue as string,
					attendees: attendees as string,
					isPublic: isPublic as boolean,
					updatedAt: new Date(),
				})
				.where(and(eq(rundowns.id, rundownId), eq(rundowns.weddingId, wedding.id)))
				.returning();

			if (updatedRundown.length === 0) {
				return fail(404, { error: 'Rundown not found' });
			}

			return { success: true, rundown: updatedRundown[0] };
		} catch (error) {
			console.error('Rundown update error:', error);
			return fail(500, {
				error: 'Failed to update rundown. Please try again.',
			});
		}
	},
	deleteRundown: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const rundownId = data.get('id') as string;

		try {
			const deletedRundown = await plannerDb
				.delete(rundowns)
				.where(and(eq(rundowns.id, rundownId), eq(rundowns.weddingId, wedding.id)))
				.returning();

			if (deletedRundown.length === 0) {
				return fail(404, { error: 'Rundown not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('Rundown deletion error:', error);
			return fail(500, {
				error: 'Failed to delete rundown. Please try again.',
			});
		}
	},
};
