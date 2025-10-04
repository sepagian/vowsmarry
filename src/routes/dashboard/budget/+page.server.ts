import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { expenseFormSchema, expenseSchema } from '$lib/validation/index';


export const load: PageServerLoad = async () => {
	const expenseForm = await superValidate(zod4(expenseFormSchema as any));
	return { expenseForm };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const expenseForm = await superValidate(request, zod4(expenseSchema as any));
	},
};
