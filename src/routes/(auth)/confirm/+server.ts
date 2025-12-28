import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createSecureLogger } from "$lib/server/logging";

const logger = createSecureLogger("EmailConfirm");

/**
 * Validate email verification token format and length
 */
function validateVerificationToken(token: string): boolean {
	// Token should be non-empty
	if (!token || token.length === 0) {
		return false;
	}

	// Token should not be excessively long (reasonable limit for security tokens)
	if (token.length > 1000) {
		return false;
	}

	// Token should contain only safe characters (alphanumeric, hyphens, underscores, dots)
	// This prevents injection attacks while allowing common token formats
	const tokenRegex = /^[a-zA-Z0-9._-]+$/;
	return tokenRegex.test(token);
}

export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get("token");
	const type = url.searchParams.get("type");

	// Validate token presence
	if (!token) {
		logger.warn("Email verification attempted without token");
		throw redirect(
			303,
			"/error?type=invalid_verification_link&message=Invalid or missing verification token"
		);
	}

	// Validate token format and length to prevent injection attacks
	if (!validateVerificationToken(token)) {
		logger.warn("Email verification attempted with invalid token format", {
			tokenLength: token.length,
			hasValidChars: /^[a-zA-Z0-9._-]+$/.test(token),
		});
		throw redirect(
			303,
			"/error?type=invalid_verification_link&message=Invalid verification token format"
		);
	}

	// Log verification attempt without exposing the token
	logger.debug("Email verification requested", {
		type,
		tokenLength: token.length,
		tokenPrefix: token.substring(0, 8) + "...", // Log only first 8 chars for debugging
	});

	// TODO: Implement Better Auth email verification
	// Better Auth requires configuring sendVerificationEmail in auth.ts
	// See: https://www.better-auth.com/docs/authentication/email
	//
	// For now, redirect to error page

	throw redirect(
		303,
		"/error?type=not_implemented&message=Email verification is not yet configured. Please contact support."
	);

	// Once configured, the implementation should be:
	// 1. Call Better Auth's /verify-email endpoint with the token
	// 2. Handle success/error responses
	// 3. Redirect to appropriate page with success message
};
