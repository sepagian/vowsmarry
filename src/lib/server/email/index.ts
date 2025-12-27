import { EMAIL_FROM } from '$env/static/private';

import { sendPlunkEmail } from './plunk';
import { renderTemplate } from './templates';

/**
 * Email result from sending operation
 */
export type EmailResult = {
	success: boolean;
	messageId?: string;
	error?: string;
};

/**
 * User information for email templates
 */
export type User = {
	name?: string;
	email: string;
};

/**
 * Unified email parameters with discriminated union
 * Supports all email types: verification, password-reset, email-update, invitation
 */
export type EmailParams =
	| {
			type: 'verification';
			to: string;
			user: User;
			verificationUrl: string;
			token: string;
	  }
	| {
			type: 'password-reset';
			to: string;
			user: User;
			resetUrl: string;
			token: string;
	  }
	| {
			type: 'email-update';
			to: string;
			user: User;
			newEmail: string;
			confirmUrl: string;
			token: string;
	  }
	| {
			type: 'invitation';
			to: string;
			inviterName: string;
			organizationName: string;
			invitationUrl: string;
			invitationId: string;
	  };

// Email validation regex - defined at module level for performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

/**
 * Log email operation for audit and debugging
 */
function logEmailOperation(
	type: EmailParams['type'],
	to: string,
	result: EmailResult
): void {
	const timestamp = new Date().toISOString();
	const status = result.success ? 'SUCCESS' : 'FAILED';

	console.log(`[${timestamp}] Email ${status}: type=${type}, to=${to}`, {
		messageId: result.messageId,
		error: result.error,
	});
}

/**
 * Send email through unified email service
 *
 * Validates recipient, renders template, sends via Plunk, and logs operation
 *
 * @param params - Email parameters with discriminated union type
 * @returns EmailResult with success status and optional messageId or error
 * @throws Error if email address is invalid or Plunk API fails
 */
export async function sendEmail(params: EmailParams): Promise<EmailResult> {
	// Validate recipient email address
	if (!isValidEmail(params.to)) {
		const error = `Invalid email address: ${params.to}`;
		logEmailOperation(params.type, params.to, { success: false, error });
		throw new Error(error);
	}

	// Render template based on email type
	const { subject, html } = renderTemplate(params);

	try {
		// Send via Plunk
		const response = await sendPlunkEmail({
			to: params.to,
			subject,
			body: html,
			from: EMAIL_FROM,
		});

		// Handle Plunk response
		if (!response.success) {
			const errorMessage = response.error || 'Email send failed';
			const result: EmailResult = { success: false, error: errorMessage };
			logEmailOperation(params.type, params.to, result);
			throw new Error(errorMessage);
		}

		// Log successful send
		const result: EmailResult = { success: true, messageId: response.id };
		logEmailOperation(params.type, params.to, result);

		return result;
	} catch (err) {
		const error = err instanceof Error ? err.message : 'Unknown error';
		const result: EmailResult = { success: false, error };
		logEmailOperation(params.type, params.to, result);
		throw err;
	}
}
