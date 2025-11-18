import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema, type ResetPasswordData } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user, supabase }, url }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');

	// Validate required parameters are present
	if (!token_hash) {
		console.error('Missing token_hash parameter in reset password URL');
		redirect(
			302,
			'/error?type=invalid_reset_link&message=Invalid password reset link. Please request a new one.',
		);
	}

	if (type && type !== 'recovery') {
		console.error('Invalid type parameter in reset password URL:', type);
		redirect(
			302,
			'/error?type=invalid_reset_link&message=Invalid password reset link type. Please request a new one.',
		);
	}

	// Check if we already have a valid session (user might have clicked the link before)
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// If user is already authenticated with a different account, sign them out first
	// to avoid conflicts with the password reset
	if (user && session) {
		await supabase.auth.signOut();
	}

	// Initialize the form with validation schema
	const resetPasswordForm = await superValidate(valibot(resetPasswordSchema));

	// Store the token_hash in the form data for validation
	if (resetPasswordForm.data && token_hash) {
		(resetPasswordForm.data as any).token = token_hash;
	}

	return {
		resetPasswordForm,
		// Pass token info for debugging (don't expose actual token)
		hasValidToken: !!token_hash && (!type || type === 'recovery'),
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(request, valibot(resetPasswordSchema));
		const formData = form.data as ResetPasswordData;
		const { token } = formData;

		try {
			// Extract token from URL parameters (Supabase provides token_hash and type)
			const token_hash = url.searchParams.get('token_hash');
			const type = url.searchParams.get('type');

			// Use token from form data as fallback if URL parameters are missing
			const resetToken = token_hash || token;

			// Validate that we have the required parameters
			if (!resetToken || (type && type !== 'recovery')) {
				console.error('Missing or invalid reset parameters:', {
					token_hash: !!token_hash,
					token: !!token,
					type,
				});
				redirect(302, '/error?type=invalid_reset_link&message=Invalid or missing reset token');
			}

			// For Supabase password reset, we need to use the session established by the reset link
			// The correct approach is to use updateUser directly if we have a valid session
			// or use verifyOtp to establish the session first

			let sessionEstablished = false;

			// Check if we already have a valid session from the reset link
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session && token_hash) {
				// If no session, verify the OTP token to establish one
				const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
					type: 'recovery',
					token_hash: token_hash,
				});

				if (verifyError) {
					console.error('Token verification error:', verifyError);

					// Handle specific verification errors
					if (
						verifyError.message.includes('expired') ||
						verifyError.message.includes('Token has expired')
					) {
						redirect(
							302,
							'/error?type=expired_reset_link&message=Your password reset link has expired. Please request a new one.',
						);
					} else if (
						verifyError.message.includes('invalid') ||
						verifyError.message.includes('Token is invalid')
					) {
						redirect(
							302,
							'/error?type=invalid_reset_link&message=Invalid reset token. Please request a new password reset.',
						);
					} else {
						redirect(
							302,
							'/error?type=invalid_reset_link&message=Unable to verify reset token. Please try again.',
						);
					}
				}

				sessionEstablished = !!verifyData.session;
			} else if (session) {
				sessionEstablished = true;
			}

			// If we still don't have a session, the token is invalid
			if (!sessionEstablished) {
				console.error('Unable to establish session for password reset');
				redirect(
					302,
					'/error?type=invalid_reset_link&message=Invalid reset session. Please request a new password reset.',
				);
			}

			// Update the user's password with the new password from the form
			const { error: updateError } = await supabase.auth.updateUser({
				password: formData.newPassword,
			});

			if (updateError) {
				console.error('Password update error:', updateError);

				// Handle specific password update errors
				if (
					updateError.message.includes('Too many requests') ||
					updateError.message.includes('rate limit')
				) {
					return fail(429, {
						form,
						message: 'Too many password reset attempts. Please wait a moment before trying again.',
					});
				} else if (updateError.message.includes('Password should be')) {
					return fail(400, {
						form,
						message:
							'Password does not meet security requirements. Please choose a stronger password.',
					});
				} else if (updateError.message.includes('same as the old password')) {
					return fail(400, {
						form,
						message: 'New password must be different from your current password.',
					});
				} else if (updateError.message.includes('session')) {
					// Session-related errors - redirect to get a fresh reset link
					redirect(
						302,
						'/error?type=invalid_reset_link&message=Your reset session has expired. Please request a new password reset.',
					);
				} else {
					return fail(400, {
						form,
						message: updateError.message || 'Failed to update password. Please try again.',
					});
				}
			}

			// Success - sign out the user and redirect to login with success message
			// This ensures they need to log in with their new password
			await supabase.auth.signOut();

			redirect(302, '/login?messageType=password_reset_success');
		} catch (err) {
			console.error('Unexpected error during password reset:', err);
			return fail(500, {
				form,
				message: 'An unexpected error occurred. Please try again.',
			});
		}
	},
};
