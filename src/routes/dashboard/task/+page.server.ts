import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { taskFormSchema } from '$lib/validation/index';
import { plannerDb } from '$lib/server/db';
import { tasks, weddings } from '$lib/server/db/schema/planner';
import { eq, count, and } from 'drizzle-orm';
import type { TaskStatus } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const taskForm = await superValidate(zod4(taskFormSchema as any));

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
			taskForm,
			stats: {
				tasksCount: 0,
				pendingTasksCount: 0,
				onProgressTasksCount: 0,
				completedTasksCount: 0,
			},
			tasks: [],
		};
	}

	const [tasksCount, pendingTasksCount, onProgressTasksCount, completedTasksCount, tasksList] =
		await Promise.all([
			plannerDb
				.select({ count: count() })
				.from(tasks)
				.where(eq(tasks.weddingId, wedding.id))
				.then((result) => result[0]?.count ?? 0),

			plannerDb
				.select({ count: count() })
				.from(tasks)
				.where(and(eq(tasks.weddingId, wedding.id), eq(tasks.status, 'pending')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb
				.select({ count: count() })
				.from(tasks)
				.where(and(eq(tasks.weddingId, wedding.id), eq(tasks.status, 'on_progress')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb
				.select({ count: count() })
				.from(tasks)
				.where(and(eq(tasks.weddingId, wedding.id), eq(tasks.status, 'completed')))
				.then((result) => result[0]?.count ?? '0'),

			plannerDb.query.tasks.findMany({
				where: eq(tasks.weddingId, wedding.id),
				orderBy: (tasks, { asc }) => [asc(tasks.dueDate)],
			}),
		]);

	return {
		taskForm,
		stats: {
			tasksCount,
			pendingTasksCount,
			onProgressTasksCount,
			completedTasksCount,
		},
		tasks: tasksList,
	};
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, zod4(taskFormSchema as any));
		if (!form.valid) return fail(400, { form });

		const { description, category, priority, status, date } = form.data as any;

		try {
			const newTask = await plannerDb
				.insert(tasks)
				.values({
					weddingId: wedding.id,
					description,
					category,
					priority,
					status,
					dueDate: date,
					createdBy: user.id,
				})
				.returning();

			return { form, success: true, task: newTask[0] };
		} catch (error) {
			console.error('Task creation error:', error);
			return fail(500, {
				form,
				error: 'Failed to create task. Please try again.',
			});
		}
	},

	updateStatus: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const taskId = data.get('id') as string;
		const newStatus = data.get('status') as TaskStatus;

		try {
			const updatedTask = await plannerDb
				.update(tasks)
				.set({
					status: newStatus,
					completedAt: newStatus === 'completed' ? new Date() : null,
					updatedAt: new Date(),
				})
				.where(and(eq(tasks.id, taskId), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (updatedTask.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true, task: updatedTask[0] };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, {
				error: 'Failed to update task status.',
			});
		}
	},

	delete: async ({ request, locals: { supabase } }) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return fail(401, { error: 'Unauthorized' });

		const wedding = await plannerDb.query.weddings.findFirst({
			where: eq(weddings.userId, user.id),
		});

		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const data = await request.formData();
		const taskId = data.get('id') as string;

		try {
			const deletedTask = await plannerDb
				.delete(tasks)
				.where(and(eq(tasks.id, taskId), eq(tasks.weddingId, wedding.id)))
				.returning();

			if (deletedTask.length === 0) {
				return fail(404, { error: 'Task not found' });
			}

			return { success: true };
		} catch (error) {
			console.error('Task deletion error:', error);
			return fail(500, {
				error: 'Failed to delete task. Please try again.',
			});
		}
	},
};
