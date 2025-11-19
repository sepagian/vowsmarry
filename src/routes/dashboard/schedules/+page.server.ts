import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { scheduleSchema, type ScheduleData } from '$lib/validation/planner';
import { plannerDb } from '$lib/server/db';
import { schedules, weddings, tasks, expenseItems } from '$lib/server/db/schema/planner';
import { eq, count, and, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals: { supabase }, depends }) => {
	depends('schedule:list');
	depends('calendar:data');
	const scheduleForm = await superValidate(valibot(scheduleSchema));

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
			schedules: [],
			tasks: [],
			expenses: [],
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

	const [rundownList, tasksList, expensesList, completedEventsCount, nextEvent, totalEvents] = await Promise.all([
		plannerDb.query.schedules.findMany({
			where: eq(schedules.weddingId, wedding.id),
			orderBy: (schedules, { asc }) => [asc(schedules.scheduleDate), asc(schedules.scheduleStartTime)],
		}),

		plannerDb.query.tasks.findMany({
			where: eq(tasks.weddingId, wedding.id),
			orderBy: (tasks, { asc }) => [asc(tasks.taskDueDate)],
		}),

		plannerDb.query.expenseItems.findMany({
			where: eq(expenseItems.weddingId, wedding.id),
			orderBy: (expenseItems, { asc }) => [asc(expenseItems.expenseDueDate)],
		}),

		plannerDb
			.select({ count: count() })
			.from(schedules)
			.where(
				and(
					eq(schedules.weddingId, wedding.id),
					sql`(${schedules.scheduleDate} + ${schedules.scheduleEndTime}) < CURRENT_TIMESTAMP`,
				),
			)
			.then((result) => result[0]?.count ?? 0),

		plannerDb.query.schedules.findFirst({
			where: and(
				eq(schedules.weddingId, wedding.id),
				sql`(${schedules.scheduleDate} + ${schedules.scheduleStartTime}) > CURRENT_TIMESTAMP`,
			),
			orderBy: (schedules, { asc }) => [asc(schedules.scheduleDate), asc(schedules.scheduleStartTime)],
		}),

		plannerDb
			.select({ count: count() })
			.from(schedules)
			.where(eq(schedules.weddingId, wedding.id))
			.then((result) => result[0]?.count ?? 0),
	]);

	const remainingEventsCount = totalEvents - completedEventsCount;

	return {
		scheduleForm,
		schedules: rundownList,
		tasks: tasksList,
		expenses: expensesList,
		stats: {
			totalEvents,
			completedEvents: completedEventsCount,
			remainingEvents: remainingEventsCount,
			nextEvent: nextEvent
				? {
						name: nextEvent.scheduleName,
						startTime: nextEvent.scheduleStartTime,
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

		const form = await superValidate(request, valibot(scheduleSchema));
		if (!form.valid) return fail(400, { form });

		const {
			scheduleName,
			scheduleCategory,
			scheduleDate,
			scheduleStartTime,
			scheduleEndTime,
			scheduleLocation,
			scheduleVenue,
			scheduleAttendees,
			isPublic,
		} = form.data as ScheduleData;

		try {
			const newSchedule = await plannerDb
				.insert(schedules)
				.values({
					weddingId: wedding.id,
					scheduleName,
					scheduleCategory,
					scheduleDate,
					scheduleStartTime,
					scheduleEndTime,
					scheduleLocation,
					scheduleVenue,
					scheduleAttendees,
					isPublic,
				})
				.returning();

			return { form, success: true, schedule: newSchedule[0] };
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

		const form = await superValidate(request, valibot(scheduleSchema));
		if (!form.valid) return fail(400, { form });

		const data = await request.formData();
		const scheduleId = data.get('id') as string;

		const {
			scheduleName,
			scheduleCategory,
			scheduleDate,
			scheduleStartTime,
			scheduleEndTime,
			scheduleLocation,
			scheduleVenue,
			scheduleAttendees,
			isPublic,
		} = form.data as ScheduleData;

		try {
			const updatedRundown = await plannerDb
				.update(schedules)
				.set({
					scheduleName,
					scheduleCategory,
					scheduleDate,
					scheduleStartTime,
					scheduleEndTime,
					scheduleLocation,
					scheduleVenue,
					scheduleAttendees,
					isPublic,
					updatedAt: new Date(),
				})
				.where(and(eq(schedules.id, scheduleId), eq(schedules.weddingId, wedding.id)))
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
		const scheduleId = data.get('id') as string;

		try {
			const deletedRundown = await plannerDb
				.delete(schedules)
				.where(and(eq(schedules.id, scheduleId), eq(schedules.weddingId, wedding.id)))
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
