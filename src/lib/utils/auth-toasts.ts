import { toast } from 'svelte-sonner';

/**
 * Standardized toast messages for authentication flows
 * Provides consistent messaging across all auth components
 */

// Success messages
export const authToasts = {
	success: {
		login: () => toast.success("Welcome back! You've been logged in successfully."),
		register: () =>
			toast.success(
				'Account created successfully! Please check your email to verify your account.',
			),
		logout: () => toast.success("You've been logged out successfully. See you soon!"),
		passwordResetRequest: () =>
			toast.info('Password reset email sent! Check your inbox for further instructions.'),
		passwordResetSuccess: () =>
			toast.success('Password updated successfully! You can now log in with your new password.'),
		emailVerification: () =>
			toast.success('Email verified successfully! You can now access all features.'),
		profileUpdate: () => toast.success('Profile updated successfully!'),
	},

	// Error messages based on Supabase error codes and types
	error: {
		// Login errors
		invalidCredentials: () =>
			toast.error('Invalid email or password. Please check your credentials and try again.'),
		emailNotConfirmed: () =>
			toast.error(
				'Please verify your email address before signing in. Check your inbox for the verification link.',
			),
		tooManyRequests: () =>
			toast.error('Too many attempts. Please wait a moment before trying again.'),
		userNotFound: () => toast.error('No account found with this email address.'),

		// Registration errors
		emailAlreadyExists: () =>
			toast.error('An account with this email already exists. Try logging in instead.'),
		weakPassword: () => toast.error('Password is too weak. Please choose a stronger password.'),
		invalidEmail: () => toast.error('Please enter a valid email address.'),

		// Password reset errors
		passwordResetFailed: () =>
			toast.error('Failed to send password reset email. Please try again.'),
		invalidResetToken: () =>
			toast.error('Invalid or expired reset link. Please request a new password reset.'),
		passwordUpdateFailed: () => toast.error('Failed to update password. Please try again.'),

		// General errors
		networkError: () => toast.error('Network error. Please check your connection and try again.'),
		serverError: () => toast.error('Something went wrong on our end. Please try again later.'),
		validationError: () => toast.error('Please fix the errors in the form before submitting.'),
		unexpectedError: () => toast.error('An unexpected error occurred. Please try again.'),

		// Session errors
		sessionExpired: () => toast.warning('Your session has expired. Please log in again.'),
		unauthorized: () => toast.error('You need to be logged in to access this feature.'),
	},

	// Warning messages
	warning: {
		sessionExpiring: () => toast.warning('Your session will expire soon. Please save your work.'),
		emailNotVerified: () => toast.warning('Please verify your email to access all features.'),
	},
};

/**
 * Maps Supabase error messages to appropriate toast functions
 */
export function handleSupabaseAuthError(error: { message: string; status?: number }) {
	const message = error.message.toLowerCase();

	// Login-specific errors
	if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
		return authToasts.error.invalidCredentials();
	}

	if (message.includes('email not confirmed') || message.includes('email not verified')) {
		return authToasts.error.emailNotConfirmed();
	}

	if (message.includes('too many requests') || error.status === 429) {
		return authToasts.error.tooManyRequests();
	}

	if (message.includes('user not found')) {
		return authToasts.error.userNotFound();
	}

	// Registration-specific errors
	if (message.includes('user already registered') || message.includes('email already exists')) {
		return authToasts.error.emailAlreadyExists();
	}

	if (message.includes('password') && (message.includes('weak') || message.includes('strength'))) {
		return authToasts.error.weakPassword();
	}

	if (message.includes('invalid email') || message.includes('email format')) {
		return authToasts.error.invalidEmail();
	}

	// Password reset errors
	if (message.includes('password reset') || message.includes('reset password')) {
		return authToasts.error.passwordResetFailed();
	}

	if (
		message.includes('invalid token') ||
		message.includes('expired token') ||
		message.includes('token')
	) {
		return authToasts.error.invalidResetToken();
	}

	// Network and server errors
	if (message.includes('network') || message.includes('fetch')) {
		return authToasts.error.networkError();
	}

	if (error.status && error.status >= 500) {
		return authToasts.error.serverError();
	}

	// Default to unexpected error
	return authToasts.error.unexpectedError();
}

/**
 * Handles form validation errors with appropriate messaging
 */
export function handleFormValidationError(hasErrors: boolean = true) {
	if (hasErrors) {
		return authToasts.error.validationError();
	}
}

/**
 * Shows success message for form submissions
 */
export function handleFormSuccess(type: keyof typeof authToasts.success, customMessage?: string) {
	if (customMessage) {
		return toast.success(customMessage);
	}
	return authToasts.success[type]();
}
