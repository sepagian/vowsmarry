import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { vendorFormSchema, vendorSchema } from '$lib/validation/vendor';

export const load: PageServerLoad = async () => {
	const vendorForm = await superValidate(zod4(vendorFormSchema as any));

	return { vendorForm };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const vendorForm = await superValidate(request, zod4(vendorSchema as any));
		console.log(vendorForm);
	},
};
