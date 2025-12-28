import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import {
	resetPasswordSchema,
	type ResetPasswordData,
} from "$lib/validation/auth";
import { createSecureLogger } from "$lib/server/logging";
import type { Actions, PageServerLoad } from "./$types";

const logger = createSecureLogger("PasswordReset");

/**
 * Validate password reset token format and length
 */
function validateResetToken(token: string): boolean {
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

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	const token = url.searchParams.get("token");

	// Validate token presence
	if (!token) {
		logger.warn("Password reset attempted without token");
		throw redirect(
			302,
			"/error?type=invalid_reset_link&message=Invalid password reset link. Please request a new one."
		);
	}

	// Validate token format to prevent injection attacks
	if (!validateResetToken(token)) {
		logger.warn("Password reset attempted with invalid token format", {
			tokenLength: token.length,
			hasValidChars: /^[a-zA-Z0-9._-]+$/.test(token),
		});
		throw redirect(
			302,
			"/error?type=invalid_reset_link&message=Invalid password reset token format. Please request a new one."
		);
	}

	// If user is already authenticated, they shouldn't be resetting password
	// (they can change it from account settings instead)
	if (user) {
		throw redirect(302, "/dashboard");
	}

	// Initialize the form with validation schema
	const resetPasswordForm = await superValidate(valibot(resetPasswordSchema));

	// Store the token in the form data for validation
	if (resetPasswordForm.data && token) {
		(resetPasswordForm.data as ResetPasswordData).token = token;
	}

	return {
		resetPasswordForm,
		hasValidToken: true,
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const form = await superValidate(request, valibot(resetPasswordSchema));
		const formData = form.data as ResetPasswordData;

		try {
			// Extract token from URL parameters
			const token = url.searchParams.get("token") || formData.token;

			// Validate that we have the required token
			if (!token) {
				logger.warn("Password reset attempted without token");
				throw redirect(
					302,
					"/error?type=invalid_reset_link&message=Invalid or missing reset token"
				);
			}

			// Validate token format to prevent injection attacks
			if (!validateResetToken(token)) {
				logger.warn("Password reset attempted with invalid token format", {
					tokenLength: token.length,
					hasValidChars: /^[a-zA-Z0-9._-]+$/.test(token),
				});
				throw redirect(
					302,
					"/error?type=invalid_reset_link&message=Invalid password reset token format"
				);
			}

			// Log reset attempt without exposing the token
			logger.debug("Password reset attempted", {
				tokenLength: token.length,
				tokenPrefix: token.substring(0, 8) + "...", // Log only first 8 chars for debugging
			});

			// TODO: Implement Better Auth password reset
			// Better Auth requires calling the /email-password/reset-password endpoint
			// See: https://www.better-auth.com/docs/authentication/email-password#request-password-reset
			//
			// For now, return a message that this feature is not yet configured

			return fail(501, {
				form,
				message:
					"Password reset functionality is not yet configured. Please contact support.",
			});

			// Once configured, the implementation should be:
			// 1. Call Better Auth's /email-password/reset-password endpoint with token and new password
			// 2. Handle success/error responses
			// 3. Redirect to login on success
		} catch (err) {
			console.error("Unexpected error during password reset:", err);
			return fail(500, {
				form,
				message: "An unexpected error occurred. Please try again.",
			});
		}
	},
};
