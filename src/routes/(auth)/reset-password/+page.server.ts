import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { passwordResetSchema } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const resetPasswordForm = await superValidate(zod4(passwordResetSchema as any));
	return { resetPasswordForm };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!newPassword || !confirmPassword) {
			return fail(400, {
				error: 'Email is required',
				newPassword,
				confirmPassword,
			});
		}

		const { error } = await supabase.auth.updateUser({ password: 'newPassword' });

		if (error) {
			console.error('Login error:', error);

			// Handle specific authentication errors
			if (error.message === 'Invalid login credentials') {
				return fail(400, {
					error: 'Invalid email or password. Please check your credentials and try again.',
					errorType: 'invalid_credentials',
				});
			} else if (error.message.includes('Email not confirmed')) {
				return fail(400, {
					error: 'Please check your email and click the verification link before signing in.',
					errorType: 'email_not_confirmed',
				});
			} else if (error.message.includes('Too many requests')) {
				return fail(429, {
					error: 'Too many login attempts. Please wait a moment before trying again.',
					errorType: 'rate_limit',
				});
			} else {
				// Generic error message for other authentication issues
				return fail(400, {
					error: error.message || 'Authentication failed. Please try again.',
					errorType: 'auth_error',
				});
			}
		}
	},
};
