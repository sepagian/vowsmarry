import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { scheduleEventFormSchema } from '$lib/validation/index';

export const load: PageServerLoad = async () => {
	const scheduleForm = await superValidate(zod4(scheduleEventFormSchema as any));
	return { scheduleForm };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const scheduleForm = await superValidate(request, zod4(scheduleEventFormSchema as any));

		if (!scheduleForm.valid) {
			return { scheduleForm };
		}

		// Here you would typically save to database
		// For now, we'll just return success
		console.log('Schedule event data:', scheduleForm.data);

		return {
			scheduleForm,
			message: 'Schedule event added successfully!',
		};
	},
};
