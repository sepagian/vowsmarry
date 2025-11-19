import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { taskFormSchema } from '$lib/validation/index';
import { plannerDb } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema/planner';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const taskForm = await superValidate(zod4(taskFormSchema as any));
	const { wedding } = await parent();

	if (!wedding) {
		return { taskForm, tasks: [] };
	}

	const dbTasks = await plannerDb.query.tasks.findMany({
		where: eq(tasks.weddingId, wedding.id),
		orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
	});

	return { taskForm, tasks: dbTasks };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const taskForm = await superValidate(request, zod4(taskFormSchema as any));
		return { taskForm };
	},
};
