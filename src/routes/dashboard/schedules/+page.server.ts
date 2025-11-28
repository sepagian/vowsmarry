import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { scheduleSchema, type ScheduleData } from '$lib/validation/planner';
import { sql } from 'kysely';
import { withAuth } from '$lib/server/auth-helpers';

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends('schedule:list');
	depends('calendar:data');
	const scheduleForm = await superValidate(valibot(scheduleSchema));

	const { user } = locals;

	if (!user) {
		redirect(302, '/login');
	}

	const wedding = await plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', user.id)
		.executeTakeFirst();

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
		plannerDb
			.selectFrom('schedules')
			.selectAll()
			.where('weddingId', '=', wedding.id)
			.orderBy('scheduleDate', 'asc')
			.orderBy('scheduleStartTime', 'asc')
			.execute(),

		plannerDb
			.selectFrom('tasks')
			.selectAll()
			.where('weddingId', '=', wedding.id)
			.orderBy('taskDueDate', 'asc')
			.execute(),

		plannerDb
			.selectFrom('expense_items')
			.selectAll()
			.where('weddingId', '=', wedding.id)
			.orderBy('expenseDueDate', 'asc')
			.execute(),

		plannerDb
			.selectFrom('schedules')
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.where('weddingId', '=', wedding.id)
			.where(sql`datetime(schedule_date || ' ' || schedule_end_time)`, '<', sql`datetime('now')`)
			.executeTakeFirst()
			.then((result) => result?.count ?? 0),

		plannerDb
			.selectFrom('schedules')
			.selectAll()
			.where('weddingId', '=', wedding.id)
			.where(sql`datetime(schedule_date || ' ' || schedule_start_time)`, '>', sql`datetime('now')`)
			.orderBy('scheduleDate', 'asc')
			.orderBy('scheduleStartTime', 'asc')
			.executeTakeFirst(),

		plannerDb
			.selectFrom('schedules')
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.where('weddingId', '=', wedding.id)
			.executeTakeFirst()
			.then((result) => result?.count ?? 0),
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
	createSchedule: withAuth(async ({ wedding, plannerDb }, { request }) => {
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
				.insertInto('schedules')
				.values({
					id: crypto.randomUUID(),
					weddingId: wedding.id,
					scheduleName,
					scheduleCategory,
					scheduleDate: String(scheduleDate),
					scheduleStartTime: String(scheduleStartTime),
					scheduleEndTime: String(scheduleEndTime),
					scheduleLocation,
					scheduleVenue,
					scheduleAttendees,
					isPublic: isPublic ? 1 : 0,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, schedule: newSchedule };
		} catch (error) {
			console.error('Create rundown error:', error);
			return fail(500, {
				form,
				error: 'Failed to add new rundown. Please try again.',
			});
		}
	}),
	updateSchedule: withAuth(async ({ wedding, plannerDb }, { request }) => {
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
				.updateTable('schedules')
				.set({
					scheduleName,
					scheduleCategory,
					scheduleDate: String(scheduleDate),
					scheduleStartTime: String(scheduleStartTime),
					scheduleEndTime: String(scheduleEndTime),
					scheduleLocation,
					scheduleVenue,
					scheduleAttendees,
					isPublic: isPublic ? 1 : 0,
					updatedAt: Date.now(),
				})
				.where('id', '=', scheduleId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedRundown) {
				return fail(404, { error: 'Rundown not found' });
			}

			return { success: true, rundown: updatedRundown };
		} catch (error) {
			console.error('Rundown update error:', error);
			return fail(500, {
				error: 'Failed to update rundown. Please try again.',
			});
		}
	}),
	deleteSchedule: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const data = await request.formData();
		const scheduleId = data.get('id') as string;

		try {
			const deletedRundown = await plannerDb
				.deleteFrom('schedules')
				.where('id', '=', scheduleId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!deletedRundown) {
				return fail(404, { error: 'Rundown not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('Rundown deletion error:', error);
			return fail(500, {
				error: 'Failed to delete rundown. Please try again.',
			});
		}
	}),
};
