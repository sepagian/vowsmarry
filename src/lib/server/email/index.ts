import {
	EMAIL_UPDATE_EMAIL_FROM,
	INVITATION_EMAIL_FROM,
	PASSWORD_RESET_EMAIL_FROM,
	VERIFICATION_EMAIL_FROM,
} from "$env/static/private";

import { createSecureLogger } from "$lib/server/logging";

import { sendResendEmail } from "./resend";
import { renderTemplate } from "./templates";

// Validate required environment variables
if (!VERIFICATION_EMAIL_FROM) {
	throw new Error("VERIFICATION_EMAIL_FROM environment variable is required");
}
if (!PASSWORD_RESET_EMAIL_FROM) {
	throw new Error("PASSWORD_RESET_EMAIL_FROM environment variable is required");
}
if (!EMAIL_UPDATE_EMAIL_FROM) {
	throw new Error("EMAIL_UPDATE_EMAIL_FROM environment variable is required");
}
if (!INVITATION_EMAIL_FROM) {
	throw new Error("INVITATION_EMAIL_FROM environment variable is required");
}

/**
 * Get the appropriate from email address based on email type
 */
function getFromEmail(type: EmailParams["type"]): string {
	switch (type) {
		case "verification":
			return VERIFICATION_EMAIL_FROM;
		case "password-reset":
			return PASSWORD_RESET_EMAIL_FROM;
		case "email-update":
			return EMAIL_UPDATE_EMAIL_FROM;
		case "invitation":
			return INVITATION_EMAIL_FROM;
		default:
			throw new Error(`Unknown email type: ${type}`);
	}
}

const logger = createSecureLogger("Email");

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
			type: "verification";
			to: string;
			baseUrl: string;
			user: User;
			verificationUrl: string;
			token: string;
	  }
	| {
			type: "password-reset";
			to: string;
			baseUrl: string;
			user: User;
			resetUrl: string;
			token: string;
	  }
	| {
			type: "email-update";
			to: string;
			baseUrl: string;
			user: User;
			newEmail: string;
			confirmUrl: string;
			token: string;
	  }
	| {
			type: "invitation";
			to: string;
			baseUrl: string;
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
	type: EmailParams["type"],
	result: EmailResult
): void {
	const status = result.success ? "success" : "failure";
	const logData: Record<string, unknown> = {
		type,
		messageId: result.messageId,
	};

	if (result.error) {
		logData.error = result.error;
	}

	if (status === "success") {
		logger.info(`Email sent: ${type}`, logData);
	} else {
		logger.warn(`Email failed to send: ${type}`, logData);
	}
}

/**
 * Send email through unified email service
 *
 * Validates recipient, renders template, sends via Resend with type-specific from addresses, and logs operation
 *
 * @param params - Email parameters with discriminated union type
 * @returns EmailResult with success status and optional messageId or error
 * @throws Error if email address is invalid or Resend API fails
 */
export async function sendEmail(params: EmailParams): Promise<EmailResult> {
	// Validate recipient email address
	if (!isValidEmail(params.to)) {
		const error = "Invalid email address";
		logEmailOperation(params.type, { success: false, error });
		throw new Error(error);
	}

	// Render template based on email type
	const { subject, html } = renderTemplate(params);

	try {
		// Send via Resend
		const response = await sendResendEmail({
			to: params.to,
			subject,
			body: html,
			from: getFromEmail(params.type),
		});

		// Handle Resend response
		if (!response.success) {
			const errorMessage = response.error || "Email send failed";
			const result: EmailResult = { success: false, error: errorMessage };
			logEmailOperation(params.type, result);
			throw new Error(errorMessage);
		}

		// Log successful send
		const result: EmailResult = { success: true, messageId: response.id };
		logEmailOperation(params.type, result);

		return result;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Unknown error";
		const result: EmailResult = { success: false, error };
		logEmailOperation(params.type, result);
		throw err;
	}
}
