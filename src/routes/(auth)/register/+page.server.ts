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

		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required',
				firstName,
				lastName,
				email,
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match',
				firstName,
				lastName,
				email,
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters long',
				firstName,
				lastName,
				email,
			});
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
				},
			},
		});

		if (error) {
			console.error('Registration error:', error);

			// Handle specific registration errors
			if (
				error.message.includes('already registered') ||
				error.message.includes('already exists')
			) {
				return fail(400, {
					error: 'An account with this email already exists. Try logging in instead.',
					errorType: 'email_already_exists',
					firstName,
					lastName,
					email,
				});
			} else if (
				error.message.includes('password') &&
				(error.message.includes('weak') || error.message.includes('strength'))
			) {
				return fail(400, {
					error: 'Password is too weak. Please choose a stronger password.',
					errorType: 'weak_password',
					firstName,
					lastName,
					email,
				});
			} else if (error.message.includes('email') && error.message.includes('invalid')) {
				return fail(400, {
					error: 'Please enter a valid email address.',
					errorType: 'invalid_email',
					firstName,
					lastName,
					email,
				});
			} else if (error.message.includes('Too many requests')) {
				return fail(429, {
					error: 'Too many registration attempts. Please wait a moment before trying again.',
					errorType: 'rate_limit',
					firstName,
					lastName,
					email,
				});
			} else {
				// Generic error message for other registration issues
				return fail(400, {
					error: error.message || 'Registration failed. Please try again.',
					errorType: 'registration_error',
					firstName,
					lastName,
					email,
				});
			}
		}

		// Redirect to login with registration success message
		redirect(302, '/login?messageType=registration_success');
	},
};
