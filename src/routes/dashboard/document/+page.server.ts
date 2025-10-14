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
		const documentForm = await superValidate(request, zod4(documentFormSchema as any));

		if (!documentForm.valid) {
			// Clear file data before returning to avoid serialization issues
			(documentForm.data as any).file = [];
			return { documentForm };
		}

		// Access the single file from the array
		const file = (documentForm.data as any).file?.[0];

		// TODO: Implement file upload logic (e.g., save to storage, database)
		// For now, just log the file information
		console.log('File uploaded:', file.name, file.type, file.size, 'bytes');

		// Clear file data before returning to avoid serialization issues
		(documentForm.data as any).file = [];
		return { documentForm };
	},
};
