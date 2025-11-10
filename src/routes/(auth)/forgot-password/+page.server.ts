import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { passwordResetRequestSchema, type PasswordResetRequestData } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const forgotPasswordForm = await superValidate(zod4(passwordResetRequestSchema as any));
	const error = url.searchParams.get('error');

	return {
		forgotPasswordForm,
		error,
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as PasswordResetRequestData['email'];

		// Configure the password reset email with proper redirect URL
		const redirectTo = `${url.origin}/reset-password`;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo,
		});

		if (error) {
			console.error('Password reset error:', error);

			// Handle specific password reset errors
			if (error.message.includes('Too many requests')) {
				return fail(429, {
					error: 'Too many password reset requests. Please wait a moment before trying again.',
					errorType: 'rate_limit',
				});
			} else if (error.message.includes('Invalid email')) {
				return fail(400, {
					error: 'Please enter a valid email address.',
					errorType: 'invalid_email',
				});
			} else {
				// For security reasons, we don't reveal if email exists or not
				// But we still log the actual error for debugging
				console.error('Password reset failed:', error.message);
			}
		}

		// Always redirect to confirmation page for security
		// Don't reveal whether email exists in system
		redirect(302, '/forgot-password/confirmation');
	},
};
