import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, '/dashboard');
	}
	return {};
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

		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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

		console.log('Login successful:', data.user?.email);
		redirect(302, '/dashboard');
	},
};
