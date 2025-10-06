import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const loginForm = await superValidate(zod4(loginSchema as any));
	return { loginForm };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const loginForm = await superValidate(request, zod4(loginSchema as any));

		if (!loginForm.valid) {
			return fail(400, { loginForm });
		}

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email,
			});
		}

		const { data } = await supabase.auth.signInWithPassword({ email, password });

		console.log('Login successful:', data.user?.email);
		redirect(302, '/dashboard');
	},
};
