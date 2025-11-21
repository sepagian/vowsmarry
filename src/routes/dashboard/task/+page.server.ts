import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { taskSchema } from '$lib/validation/planner';
import type { TaskStatus } from '$lib/types';
import type { Kysely } from 'kysely';
import type { Database } from '$lib/server/db/schema/types';

export const load: PageServerLoad = async ({ locals: { supabase }, plannerDb, depends }) => {
	depends('task:list');
	depends('calendar:data');

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) redirect(302, '/login');

	const [taskForm, wedding] = await Promise.all([
		superValidate(valibot(taskSchema)),
		plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst(),
	]);

	if (!wedding) {
		return {
			taskForm,
			taskStats: { total: 0, pending: 0, onProgress: 0, completed: 0 },
			update: { total: null, pending: null, onProgress: null, completed: null },
			tasks: [],
		};
	}

	const tasksList = await plannerDb
		.selectFrom('tasks')
		.selectAll()
		.where('weddingId', '=', wedding.id)
		.orderBy('taskDueDate', 'asc')
		.execute();

	const taskStats = tasksList.reduce(
		(acc, task) => {
			acc.total++;
			if (task.taskStatus === 'pending') acc.pending++;
			else if (task.taskStatus === 'on_progress') acc.onProgress++;
			else if (task.taskStatus === 'completed') acc.completed++;
			return acc;
		},
		{ total: 0, pending: 0, onProgress: 0, completed: 0 },
	);

	const getLatestUpdate = (status?: TaskStatus) =>
		tasksList
			.filter((t) => !status || t.taskStatus === status)
			.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0]?.updatedAt ?? null;

	return {
		taskForm,
		tasks: tasksList,
		taskStats,
		update: {
			total: getLatestUpdate(),
			pending: getLatestUpdate('pending'),
			onProgress: getLatestUpdate('on_progress'),
			completed: getLatestUpdate('completed'),
		},
	};
};

async function getWedding(userId: string, plannerDb: Kysely<Database>) {
	return plannerDb
		.selectFrom('weddings')
		.selectAll()
		.where('userId', '=', userId)
		.executeTakeFirst();
}

async function getUser(supabase: { auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> } }) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw fail(401, { error: 'Unauthorized' });
	return user;
}

export const actions: Actions = {
	create: async ({ request, locals: { supabase }, plannerDb }) => {
		const user = await getUser(supabase);
		const wedding = await getWedding(user.id, plannerDb);
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const form = await superValidate(request, valibot(taskSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const newTask = await plannerDb
				.insertInto('tasks')
				.values({
					id: crypto.randomUUID(),
					weddingId: wedding.id,
					taskDescription: form.data.taskDescription,
					taskCategory: form.data.taskCategory,
					taskPriority: form.data.taskPriority,
					taskStatus: form.data.taskStatus,
					taskDueDate: form.data.taskDueDate.toString(),
					completedAt: null,
					assignedTo: null,
					createdBy: user.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, task: newTask };
		} catch (error) {
			console.error('Task creation error:', error);
			return fail(500, { form, error: 'Failed to create task. Please try again.' });
		}
	},

	updateStatus: async ({ request, locals: { supabase }, plannerDb }) => {
		const user = await getUser(supabase);
		const wedding = await getWedding(user.id, plannerDb);
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const formData = await request.formData();
		const taskId = formData.get('id') as string;
		const newStatus = formData.get('status') as TaskStatus;

		try {
			const updatedTask = await plannerDb
				.updateTable('tasks')
				.set({
					taskStatus: newStatus,
					completedAt: newStatus === 'completed' ? new Date() : null,
					updatedAt: new Date(),
				})
				.where('id', '=', taskId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedTask) return fail(404, { error: 'Task not found' });

			return { success: true, task: updatedTask };
		} catch (error) {
			console.error('Status update error:', error);
			return fail(500, { error: 'Failed to update task status.' });
		}
	},

	update: async ({ request, locals: { supabase }, plannerDb }) => {
		const user = await getUser(supabase);
		const wedding = await getWedding(user.id, plannerDb);
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const clonedRequest = request.clone();
		const formData = await clonedRequest.formData();
		const taskId = formData.get('id') as string;
		if (!taskId) return fail(400, { error: 'Missing task ID' });

		const form = await superValidate(request, valibot(taskSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const updatedTask = await plannerDb
				.updateTable('tasks')
				.set({
					...form.data,
					completedAt: form.data.taskStatus === 'completed' ? new Date() : null,
					updatedAt: new Date(),
				})
				.where('id', '=', taskId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedTask) return fail(404, { error: 'Task not found' });

			return { form, success: true, task: updatedTask };
		} catch (error) {
			console.error('Task update error:', error);
			return fail(500, { form, error: 'Failed to update task. Please try again.' });
		}
	},

	delete: async ({ request, locals: { supabase }, plannerDb }) => {
		const user = await getUser(supabase);
		const wedding = await getWedding(user.id, plannerDb);
		if (!wedding) return fail(403, { error: 'No wedding data found' });

		const formData = await request.formData();
		const taskId = formData.get('id') as string;

		try {
			const deletedTask = await plannerDb
				.deleteFrom('tasks')
				.where('id', '=', taskId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!deletedTask) return fail(404, { error: 'Task not found' });

			return { success: true };
		} catch (error) {
			console.error('Task deletion error:', error);
			return fail(500, { error: 'Failed to delete task. Please try again.' });
		}
	},
};
