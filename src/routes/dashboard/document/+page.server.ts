import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { documentFormSchema, documentSchema } from '$lib/validation/index';

export const load: PageServerLoad = async () => {
	const documentForm = await superValidate(zod4(documentFormSchema as any));

	return { documentForm };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const documentForm = await superValidate(request, zod4(documentSchema as any));
	},
};
