import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/dashboard';

	if (!token_hash || !type) {
		throw redirect(303, '/error?type=invalid_verification_link&message=Invalid or missing verification token');
	}

	const { error } = await supabase.auth.verifyOtp({ type, token_hash });

	if (error) {
		console.error('OTP verification failed:', error.message);
		
		// Handle specific verification errors
		if (error.message.includes('expired')) {
			throw redirect(303, '/error?type=expired_verification_link&message=Your email verification link has expired');
		} else if (error.message.includes('invalid')) {
			throw redirect(303, '/error?type=invalid_verification_link&message=Invalid verification token');
		} else {
			throw redirect(303, '/error?type=verification_failed&message=Email verification failed');
		}
	}

	// Success - redirect to destination with success message
	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');
	redirectTo.searchParams.delete('next');
	
	// Add success message for email verification with proper type
	if (type === 'email') {
		redirectTo.searchParams.set('message', 'Email verified successfully! You can now access all features.');
		redirectTo.searchParams.set('messageType', 'email_verification_success');
	} else if (type === 'signup') {
		redirectTo.searchParams.set('message', 'Account verified successfully! Welcome to the platform.');
		redirectTo.searchParams.set('messageType', 'signup_verification_success');
	} else if (type === 'recovery') {
		// Handle password reset verification
		redirectTo.searchParams.set('message', 'Email verified for password reset. You can now set your new password.');
		redirectTo.searchParams.set('messageType', 'password_reset_verification_success');
	}

	throw redirect(303, redirectTo);
};
