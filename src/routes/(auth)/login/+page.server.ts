import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const loginForm = await superValidate(zod4(loginSchema as any));
	const message = url.searchParams.get('message');
	
	return { 
		loginForm,
		message 
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email,
			});
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			console.error('Login error:', error);

			// Handle specific authentication errors
			if (error.message === 'Invalid login credentials') {
				return fail(400, {
					error: 'Invalid email or password. Please check your credentials and try again.',
					errorType: 'invalid_credentials',
					email,
				});
			} else if (error.message.includes('Email not confirmed')) {
				return fail(400, {
					error: 'Please check your email and click the verification link before signing in.',
					errorType: 'email_not_confirmed',
					email,
				});
			} else if (error.message.includes('Too many requests')) {
				return fail(429, {
					error: 'Too many login attempts. Please wait a moment before trying again.',
					errorType: 'rate_limit',
					email,
				});
			} else {
				// Generic error message for other authentication issues
				return fail(400, {
					error: error.message || 'Authentication failed. Please try again.',
					errorType: 'auth_error',
					email,
				});
			}
		}

		redirect(302, '/dashboard');
	},
};
