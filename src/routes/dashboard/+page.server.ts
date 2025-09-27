import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { taskFormSchema } from '$lib/validation/task';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(taskFormSchema as any));

	return { form };
};
