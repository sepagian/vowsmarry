import { toast } from 'svelte-sonner';

/**
 * Better Auth error codes
 * @see https://better-auth.com/docs/errors
 */
export const BETTER_AUTH_ERROR_CODES = {
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
	EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
	RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
	WEAK_PASSWORD: 'WEAK_PASSWORD',
	INVALID_EMAIL: 'INVALID_EMAIL',
	PASSWORD_RESET_FAILED: 'PASSWORD_RESET_FAILED',
	INVALID_TOKEN: 'INVALID_TOKEN',
	NETWORK_ERROR: 'NETWORK_ERROR',
	SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type BetterAuthErrorCode = typeof BETTER_AUTH_ERROR_CODES[keyof typeof BETTER_AUTH_ERROR_CODES];

/**
 * Authentication toast messages
 * Centralized message definitions for consistency and potential i18n support
 */
export const AUTH_MESSAGES = {
	success: {
		login: "Welcome back! You've been logged in successfully.",
		register: 'Account created successfully! Please check your email to verify your account.',
		logout: "You've been logged out successfully. See you soon!",
		passwordResetRequest: 'Password reset email sent! Check your inbox for further instructions.',
		passwordResetSuccess: 'Password updated successfully! You can now log in with your new password.',
		emailVerification: 'Email verified successfully! You can now access all features.',
		profileUpdate: 'Profile updated successfully!',
	},
	error: {
		invalidCredentials: 'Invalid email or password. Please check your credentials and try again.',
		emailNotConfirmed: 'Please verify your email address before signing in. Check your inbox for the verification link.',
		tooManyRequests: 'Too many attempts. Please wait a moment before trying again.',
		userNotFound: 'No account found with this email address.',
		emailAlreadyExists: 'An account with this email already exists. Try logging in instead.',
		weakPassword: 'Password is too weak. Please choose a stronger password.',
		invalidEmail: 'Please enter a valid email address.',
		passwordResetFailed: 'Failed to send password reset email. Please try again.',
		invalidResetToken: 'Invalid or expired reset link. Please request a new password reset.',
		passwordUpdateFailed: 'Failed to update password. Please try again.',
		networkError: 'Network error. Please check your connection and try again.',
		serverError: 'Something went wrong on our end. Please try again later.',
		validationError: 'Please fix the errors in the form before submitting.',
		unexpectedError: 'An unexpected error occurred. Please try again.',
		sessionExpired: 'Your session has expired. Please log in again.',
		unauthorized: 'You need to be logged in to access this feature.',
	},
	warning: {
		sessionExpiring: 'Your session will expire soon. Please save your work.',
		emailNotVerified: 'Please verify your email to access all features.',
	},
} as const;

/**
 * Standardized toast functions for authentication flows
 * Provides consistent messaging across all auth components
 */
export const authToasts = {
	success: {
		login: () => toast.success(AUTH_MESSAGES.success.login),
		register: () => toast.success(AUTH_MESSAGES.success.register),
		logout: () => toast.success(AUTH_MESSAGES.success.logout),
		passwordResetRequest: () => toast.info(AUTH_MESSAGES.success.passwordResetRequest),
		passwordResetSuccess: () => toast.success(AUTH_MESSAGES.success.passwordResetSuccess),
		emailVerification: () => toast.success(AUTH_MESSAGES.success.emailVerification),
		profileUpdate: () => toast.success(AUTH_MESSAGES.success.profileUpdate),
	},
	error: {
		invalidCredentials: () => toast.error(AUTH_MESSAGES.error.invalidCredentials),
		emailNotConfirmed: () => toast.error(AUTH_MESSAGES.error.emailNotConfirmed),
		tooManyRequests: () => toast.error(AUTH_MESSAGES.error.tooManyRequests),
		userNotFound: () => toast.error(AUTH_MESSAGES.error.userNotFound),
		emailAlreadyExists: () => toast.error(AUTH_MESSAGES.error.emailAlreadyExists),
		weakPassword: () => toast.error(AUTH_MESSAGES.error.weakPassword),
		invalidEmail: () => toast.error(AUTH_MESSAGES.error.invalidEmail),
		passwordResetFailed: () => toast.error(AUTH_MESSAGES.error.passwordResetFailed),
		invalidResetToken: () => toast.error(AUTH_MESSAGES.error.invalidResetToken),
		passwordUpdateFailed: () => toast.error(AUTH_MESSAGES.error.passwordUpdateFailed),
		networkError: () => toast.error(AUTH_MESSAGES.error.networkError),
		serverError: () => toast.error(AUTH_MESSAGES.error.serverError),
		validationError: () => toast.error(AUTH_MESSAGES.error.validationError),
		unexpectedError: () => toast.error(AUTH_MESSAGES.error.unexpectedError),
		sessionExpired: () => toast.warning(AUTH_MESSAGES.error.sessionExpired),
		unauthorized: () => toast.error(AUTH_MESSAGES.error.unauthorized),
	},
	warning: {
		sessionExpiring: () => toast.warning(AUTH_MESSAGES.warning.sessionExpiring),
		emailNotVerified: () => toast.warning(AUTH_MESSAGES.warning.emailNotVerified),
	},
} as const;

/**
 * Error code to toast handler mapping
 * Uses Strategy Pattern for maintainable error handling
 */
const ERROR_CODE_TO_TOAST_MAP: Record<string, () => void> = {
	[BETTER_AUTH_ERROR_CODES.INVALID_CREDENTIALS]: authToasts.error.invalidCredentials,
	[BETTER_AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: authToasts.error.emailNotConfirmed,
	[BETTER_AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED]: authToasts.error.tooManyRequests,
	[BETTER_AUTH_ERROR_CODES.USER_NOT_FOUND]: authToasts.error.userNotFound,
	[BETTER_AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS]: authToasts.error.emailAlreadyExists,
	[BETTER_AUTH_ERROR_CODES.WEAK_PASSWORD]: authToasts.error.weakPassword,
	[BETTER_AUTH_ERROR_CODES.INVALID_EMAIL]: authToasts.error.invalidEmail,
	[BETTER_AUTH_ERROR_CODES.PASSWORD_RESET_FAILED]: authToasts.error.passwordResetFailed,
	[BETTER_AUTH_ERROR_CODES.INVALID_TOKEN]: authToasts.error.invalidResetToken,
	[BETTER_AUTH_ERROR_CODES.NETWORK_ERROR]: authToasts.error.networkError,
	[BETTER_AUTH_ERROR_CODES.SERVER_ERROR]: authToasts.error.serverError,
};

/**
 * Maps Better Auth error codes to appropriate toast notifications
 * 
 * @param error - Error object from Better Auth
 * @param error.message - Human-readable error message
 * @param error.status - HTTP status code (optional)
 * @param error.code - Better Auth error code (optional)
 * 
 * @example
 * ```typescript
 * try {
 *   await authClient.signIn({ email, password });
 * } catch (error) {
 *   handleAuthError(error);
 * }
 * ```
 */
export function handleAuthError(error: { 
	message: string; 
	status?: number; 
	code?: BetterAuthErrorCode | string;
}): void {
	if (!error.code) {
		authToasts.error.unexpectedError();
		return;
	}

	const toastHandler = ERROR_CODE_TO_TOAST_MAP[error.code];
	if (toastHandler) {
		toastHandler();
	} else {
		authToasts.error.unexpectedError();
	}
}

/**
 * Shows validation error message for form submissions
 * Used when form validation fails before submission
 */
export function handleFormValidationError(): void {
	authToasts.error.validationError();
}

/**
 * Shows success message for form submissions
 * 
 * @param type - Type of success message to display
 * @param customMessage - Optional custom message to override default
 * 
 * @example
 * ```typescript
 * handleFormSuccess('login');
 * handleFormSuccess('register', 'Welcome! Check your email.');
 * ```
 */
export function handleFormSuccess(
	type: keyof typeof authToasts.success, 
	customMessage?: string
): void {
	if (customMessage) {
		toast.success(customMessage);
	} else {
		authToasts.success[type]();
	}
}
