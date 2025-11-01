import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { taskFormSchema, expenseFormSchema } from '$lib/validation/index';

export const load: PageServerLoad = async () => {
	const taskForm = await superValidate(zod4(taskFormSchema as any));
	const expenseForm = await superValidate(zod4(expenseFormSchema as any));
	return { taskForm, expenseForm };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const taskForm = await superValidate(request, zod4(taskFormSchema as any));
		const expenseForm = await superValidate(request, zod4(expenseFormSchema as any));
		return { taskForm, expenseForm };
	},
};
