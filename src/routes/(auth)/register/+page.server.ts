import { fail, redirect } from '@sveltejs/kit';
import { createUser, getUserByEmail } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Validation
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required',
				firstName,
				lastName,
				email
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match',
				firstName,
				lastName,
				email
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters long',
				firstName,
				lastName,
				email
			});
		}

		// Check if user already exists
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return fail(400, {
				error: 'An account with this email already exists',
				firstName,
				lastName,
				email
			});
		}

		try {
			const { user, emailVerificationToken } = await createUser(email, password, firstName, lastName);
			
			// In a real app, you would send an email with the verification token
			console.log('Email verification token:', emailVerificationToken);
			
			return {
				success: 'Account created successfully! Please check your email to verify your account.'
			};
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, {
				error: 'Failed to create account. Please try again.',
				firstName,
				lastName,
				email
			});
		}
	}
};