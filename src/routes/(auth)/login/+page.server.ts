import { fail, redirect } from '@sveltejs/kit';
import { getUserByEmail, verifyPassword, generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { loginSchema } from '$lib/validation/schemas';
import { FormValidator } from '$lib/validation/form-validator';
import { InvalidCredentialsError, EmailNotVerifiedError, createFormError } from '$lib/errors';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			const formData = await request.formData();
			const rawData = FormValidator.formDataToObject(formData);

			// Validate form data
			const validation = FormValidator.validateForm(loginSchema, rawData);
			if (!validation.success) {
				return fail(400, createFormError(validation.error));
			}

			const { email, password } = validation.data;

			// Check if user exists
			const user = await getUserByEmail(email);
			if (!user) {
				throw new InvalidCredentialsError();
			}

			// Verify password
			const validPassword = await verifyPassword(password, user.passwordHash);
			if (!validPassword) {
				throw new InvalidCredentialsError();
			}

			// Check email verification
			if (!user.emailVerified) {
				throw new EmailNotVerifiedError();
			}

			// Create session
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, user.id);
			setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

			throw redirect(302, '/dashboard');

		} catch (error) {
			console.error('Login error:', error);
			return fail(400, createFormError(error));
		}
	}
};