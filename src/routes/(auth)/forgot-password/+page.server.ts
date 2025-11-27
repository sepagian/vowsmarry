import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { forgotPasswordSchema, type ForgotPasswordData } from '$lib/validation/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	if (user) {
		redirect(302, '/dashboard');
	}

	const forgotPasswordForm = await superValidate(valibot(forgotPasswordSchema));
	const error = url.searchParams.get('error');

	return {
		forgotPasswordForm,
		error,
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as ForgotPasswordData['email'];

		const redirectTo = `${url.origin}/reset-password`;

		// TODO: Implement Better Auth password reset
		// Better Auth requires configuring sendResetPassword in auth.ts
		// See: https://www.better-auth.com/docs/authentication/email-password#request-password-reset
		// 
		// For now, return a message that this feature is not yet configured
		console.log('Password reset requested for:', email, 'with redirect:', redirectTo);
		
		return fail(501, {
			error: 'Password reset functionality is not yet configured. Please contact support.',
			errorType: 'not_implemented',
		});

		// Once configured, the implementation should be:
		// 1. Call Better Auth's /request-password-reset endpoint
		// 2. Better Auth will trigger sendResetPassword callback configured in auth.ts
		// 3. Send email with reset link containing token
		// 4. Always redirect to confirmation page for security
	},
};
