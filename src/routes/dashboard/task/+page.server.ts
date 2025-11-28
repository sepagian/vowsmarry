import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { taskSchema } from '$lib/validation/planner';
import type { TaskStatus } from '$lib/types';
import { withAuth } from '$lib/server/auth-helpers';
import { handleActionError } from '$lib/server/error-handler';
import { FormDataParser } from '$lib/utils/form-helpers';

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends('task:list');
	depends('calendar:data');

	const { user } = locals;

	if (!user) redirect(302, '/login');

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
			.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))[0]?.updatedAt ?? null;

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

export const actions: Actions = {
	createTask: withAuth(async ({ user, wedding, plannerDb }, { request }) => {
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
					taskDueDate: String(form.data.taskDueDate),
					completedAt: null,
					assignedTo: null,
					createdBy: user.id,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return { form, success: true, task: newTask };
		} catch (error) {
			return handleActionError(error, 'create task', { form });
		}
	}),

	updateTaskStatus: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			const parser = new FormDataParser(await request.formData());
			const taskId = parser.getString('id');
			const newStatus = parser.getEnum('status', ['pending', 'on_progress', 'completed'] as const);

			const updatedTask = await plannerDb
				.updateTable('tasks')
				.set({
					taskStatus: newStatus,
					completedAt: newStatus === 'completed' ? Date.now() : null,
					updatedAt: Date.now(),
				})
				.where('id', '=', taskId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedTask) return fail(404, { error: 'Task not found' });

			return { success: true, task: updatedTask };
		} catch (error) {
			return handleActionError(error, 'update task status');
		}
	}),

	updateTask: withAuth(async ({ wedding, plannerDb }, { request }) => {
		const clonedRequest = request.clone();
		const parser = new FormDataParser(await clonedRequest.formData());
		const taskId = parser.getString('id');

		const form = await superValidate(request, valibot(taskSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const updatedTask = await plannerDb
				.updateTable('tasks')
				.set({
					...form.data,
					taskDueDate: String(form.data.taskDueDate),
					completedAt: form.data.taskStatus === 'completed' ? Date.now() : null,
					updatedAt: Date.now(),
				})
				.where('id', '=', taskId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!updatedTask) return fail(404, { form, error: 'Task not found' });

			return { form, success: true, task: updatedTask };
		} catch (error) {
			return handleActionError(error, 'update task', { form });
		}
	}),

	deleteTask: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			const parser = new FormDataParser(await request.formData());
			const taskId = parser.getString('id');

			const deletedTask = await plannerDb
				.deleteFrom('tasks')
				.where('id', '=', taskId)
				.where('weddingId', '=', wedding.id)
				.returningAll()
				.executeTakeFirst();

			if (!deletedTask) return fail(404, { error: 'Task not found' });

			return { success: true };
		} catch (error) {
			return handleActionError(error, 'delete task');
		}
	}),
};
