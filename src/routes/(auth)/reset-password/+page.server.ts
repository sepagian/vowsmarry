import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema, type ResetPasswordData } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	const token = url.searchParams.get('token');

	// Validate required parameters are present
	if (!token) {
		console.error('Missing token parameter in reset password URL');
		redirect(
			302,
			'/error?type=invalid_reset_link&message=Invalid password reset link. Please request a new one.',
		);
	}

	// If user is already authenticated, they shouldn't be resetting password
	// (they can change it from account settings instead)
	if (user) {
		redirect(302, '/dashboard');
	}

	// Initialize the form with validation schema
	const resetPasswordForm = await superValidate(valibot(resetPasswordSchema));

	// Store the token in the form data for validation
	if (resetPasswordForm.data && token) {
		(resetPasswordForm.data as ResetPasswordData).token = token;
	}

	return {
		resetPasswordForm,
		// Pass token info for debugging (don't expose actual token)
		hasValidToken: !!token,
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const form = await superValidate(request, valibot(resetPasswordSchema));
		const formData = form.data as ResetPasswordData;

		try {
			// Extract token from URL parameters
			const token = url.searchParams.get('token') || formData.token;

			// Validate that we have the required token
			if (!token) {
				console.error('Missing reset token');
				redirect(302, '/error?type=invalid_reset_link&message=Invalid or missing reset token');
			}

			// TODO: Implement Better Auth password reset
			// Better Auth requires calling the /email-password/reset-password endpoint
			// See: https://www.better-auth.com/docs/authentication/email-password#request-password-reset
			//
			// For now, return a message that this feature is not yet configured
			console.log('Password reset attempted with token:', token);
			
			return fail(501, {
				form,
				message: 'Password reset functionality is not yet configured. Please contact support.',
			});

			// Once configured, the implementation should be:
			// 1. Call Better Auth's /email-password/reset-password endpoint with token and new password
			// 2. Handle success/error responses
			// 3. Redirect to login on success
		} catch (err) {
			console.error('Unexpected error during password reset:', err);
			return fail(500, {
				form,
				message: 'An unexpected error occurred. Please try again.',
			});
		}
	},
};
