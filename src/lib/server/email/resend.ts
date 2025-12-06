import { Resend } from 'resend';
import { RESEND_API_KEY, EMAIL_FROM } from '$env/static/private';

if (!RESEND_API_KEY) {
	throw new Error('RESEND_API_KEY environment variable is required');
}

if (!EMAIL_FROM) {
	throw new Error('EMAIL_FROM environment variable is required');
}

/**
 * Resend client instance
 * Configured with API key from environment variables
 */
export const resend = new Resend(RESEND_API_KEY);

/**
 * Default sender email address
 */
export const FROM_EMAIL = EMAIL_FROM;
