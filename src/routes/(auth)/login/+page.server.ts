import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/validation/auth';
import { getAuth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const loginForm = await superValidate(valibot(loginSchema));
	const message = url.searchParams.get('message');
	const messageType = url.searchParams.get('messageType');
	const error = url.searchParams.get('error');
	const errorType = url.searchParams.get('errorType');

	return {
		loginForm,
		message,
		messageType,
		error,
		errorType,
	};
};

export const actions: Actions = {
	default: async ({ request, platform }) => {
		if (!platform?.env?.vowsmarry) {
			return fail(500, {
				error: 'Database configuration error',
			});
		}

		const auth = getAuth(platform.env.vowsmarry);
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email,
			});
		}

		try {
			// Use Better Auth to sign in
			const result = await auth.api.signInEmail({
				body: {
					email,
					password,
				},
			});

			console.log('Sign in result:', result);

			// Check if sign in was successful
			if (!result) {
				return fail(400, {
					error: 'Authentication failed. Please try again.',
					errorType: 'auth_error',
					email,
				});
			}

			console.log('About to redirect to dashboard');
		} catch (error: unknown) {
			console.error('Login error:', error);

			// Handle specific authentication errors from Better Auth
			const errorMessage = error instanceof Error 
				? error.message 
				: typeof error === 'object' && error !== null && 'message' in error
					? String((error as { message: unknown }).message)
					: '';
			
			if (errorMessage.includes('Invalid') || errorMessage.includes('credentials')) {
				return fail(400, {
					error: 'Invalid email or password. Please check your credentials and try again.',
					errorType: 'invalid_credentials',
					email,
				});
			} else if (errorMessage.includes('not verified') || errorMessage.includes('Email not confirmed')) {
				return fail(400, {
					error: 'Please check your email and click the verification link before signing in.',
					errorType: 'email_not_confirmed',
					email,
				});
			} else if (errorMessage.includes('Too many') || errorMessage.includes('rate limit')) {
				return fail(429, {
					error: 'Too many login attempts. Please wait a moment before trying again.',
					errorType: 'rate_limit',
					email,
				});
			} else {
				// Generic error message for other authentication issues
				return fail(400, {
					error: errorMessage || 'Authentication failed. Please try again.',
					errorType: 'auth_error',
					email,
				});
			}
		}

		// Redirect to dashboard on success (outside try-catch to avoid catching redirect)
		throw redirect(303, '/dashboard');
	},
};
