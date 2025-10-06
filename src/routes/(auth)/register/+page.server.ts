import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { registrationSchema } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const registrationForm = await superValidate(zod4(registrationSchema as any));
	return { registrationForm };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const registrationForm = await superValidate(request, zod4(registrationSchema as any));

		if (!registrationForm.valid) {
			return fail(400, { registrationForm });
		}

		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required',
				firstName,
				lastName,
				email,
			});
		}

		const { data } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
				},
			},
		});

		console.log('Login successful:', data.user?.email);
		redirect(302, '/dashboard');
	},
};
