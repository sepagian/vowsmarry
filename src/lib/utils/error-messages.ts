/**
 * Error message mapping and utilities for authentication errors
 */

export type ErrorCategory =
	| 'password_reset'
	| 'email_verification'
	| 'authentication'
	| 'network'
	| 'server'
	| 'generic';

export interface ErrorConfig {
	title: string;
	description: string;
	icon: string;
	category: ErrorCategory;
	actions: Array<{
		label: string;
		href: string;
		variant: 'default' | 'outline' | 'destructive';
	}>;
}

export const ERROR_CONFIGS: Record<string, ErrorConfig> = {
	// Password Reset Errors
	invalid_reset_link: {
		title: 'Invalid Reset Link',
		description:
			'This password reset link is invalid or has already been used. Reset links can only be used once for security.',
		icon: 'i-lucide:link-off',
		category: 'password_reset',
		actions: [
			{ label: 'Request New Reset Link', href: '/forgot-password', variant: 'default' },
			{ label: 'Back to Login', href: '/login', variant: 'outline' },
		],
	},
	expired_reset_link: {
		title: 'Reset Link Expired',
		description:
			'This password reset link has expired. For security reasons, reset links are only valid for 24 hours.',
		icon: 'i-lucide:clock-x',
		category: 'password_reset',
		actions: [
			{ label: 'Request New Reset Link', href: '/forgot-password', variant: 'default' },
			{ label: 'Back to Login', href: '/login', variant: 'outline' },
		],
	},
	reset_link_error: {
		title: 'Reset Link Problem',
		description:
			'There was an issue processing your password reset link. This may be due to the link being malformed or corrupted.',
		icon: 'i-lucide:link-off',
		category: 'password_reset',
		actions: [
			{ label: 'Request New Reset Link', href: '/forgot-password', variant: 'default' },
			{ label: 'Back to Login', href: '/login', variant: 'outline' },
		],
	},

	// Email Verification Errors
	invalid_verification_link: {
		title: 'Invalid Verification Link',
		description:
			'This email verification link is invalid or has already been used. If you already verified your email, you can log in normally.',
		icon: 'i-lucide:mail-x',
		category: 'email_verification',
		actions: [
			{ label: 'Back to Login', href: '/login', variant: 'default' },
			{ label: 'Create New Account', href: '/register', variant: 'outline' },
		],
	},
	expired_verification_link: {
		title: 'Verification Link Expired',
		description:
			'This email verification link has expired. Verification links are valid for 24 hours after registration.',
		icon: 'i-lucide:clock-x',
		category: 'email_verification',
		actions: [
			{ label: 'Back to Login', href: '/login', variant: 'default' },
			{ label: 'Create New Account', href: '/register', variant: 'outline' },
		],
	},
	verification_link_error: {
		title: 'Verification Link Problem',
		description:
			'There was an issue processing your email verification link. The link may be malformed or corrupted.',
		icon: 'i-lucide:mail-x',
		category: 'email_verification',
		actions: [
			{ label: 'Back to Login', href: '/login', variant: 'default' },
			{ label: 'Create New Account', href: '/register', variant: 'outline' },
		],
	},

	// Authentication Errors
	auth_error: {
		title: 'Authentication Error',
		description:
			'There was a problem with your authentication. This could be due to invalid credentials or account issues.',
		icon: 'i-lucide:shield-x',
		category: 'authentication',
		actions: [
			{ label: 'Try Again', href: '/login', variant: 'default' },
			{ label: 'Create Account', href: '/register', variant: 'outline' },
		],
	},
	session_expired: {
		title: 'Session Expired',
		description: 'Your session has expired for security reasons. Please log in again to continue.',
		icon: 'i-lucide:clock-x',
		category: 'authentication',
		actions: [
			{ label: 'Log In Again', href: '/login', variant: 'default' },
			{ label: 'Go Home', href: '/', variant: 'outline' },
		],
	},
	unauthorized: {
		title: 'Access Denied',
		description:
			"You don't have permission to access this resource. Please log in with the appropriate account.",
		icon: 'i-lucide:shield-x',
		category: 'authentication',
		actions: [
			{ label: 'Log In', href: '/login', variant: 'default' },
			{ label: 'Go Home', href: '/', variant: 'outline' },
		],
	},
	account_locked: {
		title: 'Account Locked',
		description:
			'Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.',
		icon: 'i-lucide:lock',
		category: 'authentication',
		actions: [
			{ label: 'Reset Password', href: '/forgot-password', variant: 'default' },
			{ label: 'Contact Support', href: '/contact', variant: 'outline' },
		],
	},

	// Network and Server Errors
	network_error: {
		title: 'Connection Problem',
		description:
			'Unable to connect to our servers. Please check your internet connection and try again.',
		icon: 'i-lucide:wifi-off',
		category: 'network',
		actions: [
			{ label: 'Retry', href: '/login', variant: 'default' },
			{ label: 'Go Home', href: '/', variant: 'outline' },
		],
	},
	server_error: {
		title: 'Server Error',
		description:
			'Our servers are experiencing issues. Please try again in a few minutes. If the problem persists, contact support.',
		icon: 'i-lucide:server-x',
		category: 'server',
		actions: [
			{ label: 'Try Again', href: '/login', variant: 'default' },
			{ label: 'Go Home', href: '/', variant: 'outline' },
		],
	},
	maintenance: {
		title: 'Maintenance Mode',
		description:
			"We're currently performing scheduled maintenance. Please check back in a few minutes.",
		icon: 'i-lucide:wrench',
		category: 'server',
		actions: [
			{ label: 'Try Again', href: '/login', variant: 'default' },
			{ label: 'Go Home', href: '/', variant: 'outline' },
		],
	},

	// Generic Errors
	generic: {
		title: 'Something Went Wrong',
		description:
			'An unexpected error occurred. Our team has been notified and is working to resolve the issue.',
		icon: 'i-lucide:alert-triangle',
		category: 'generic',
		actions: [
			{ label: 'Back to Login', href: '/login', variant: 'default' },
			{ label: 'Create Account', href: '/register', variant: 'outline' },
		],
	},
	unknown: {
		title: 'Unknown Error',
		description:
			'An unknown error occurred. Please try again or contact support if the problem persists.',
		icon: 'i-lucide:help-circle',
		category: 'generic',
		actions: [
			{ label: 'Try Again', href: '/login', variant: 'default' },
			{ label: 'Contact Support', href: '/contact', variant: 'outline' },
		],
	},
};

/**
 * Get error configuration by type with fallback to generic
 */
export function getErrorConfig(errorType: string): ErrorConfig {
	return ERROR_CONFIGS[errorType] || ERROR_CONFIGS.generic;
}

/**
 * Create error URL with query parameters
 */
export function createErrorUrl(type: string, message?: string, context?: string): string {
	const params = new URLSearchParams({ type });
	if (message) params.set('message', message);
	if (context) params.set('context', context);
	return `/error?${params.toString()}`;
}

/**
 * Set error state for client-side navigation (avoids URL parameters)
 * Note: This should be called from client-side code before navigation
 */
export function setErrorState(type: string, message?: string, context?: string): void {
	// Import store dynamically to avoid circular dependencies
	import('$lib/stores/error')
		.then(({ errorStore }) => {
			errorStore.setError({ type, message, context });
		})
		.catch((e) => {
			console.warn('Failed to set error state:', e);
		});
}

/**
 * Map authentication error codes to our error types
 * @deprecated Legacy function - kept for backward compatibility
 */
export function mapSupabaseError(error: any): string {
	if (!error) return 'generic';

	const message = error.message?.toLowerCase() || '';
	const code = error.code || error.status;

	// Map specific authentication error codes and messages
	if (message.includes('invalid_grant') || message.includes('invalid token')) {
		if (message.includes('reset')) return 'invalid_reset_link';
		if (message.includes('verification') || message.includes('confirm'))
			return 'invalid_verification_link';
		return 'auth_error';
	}

	if (message.includes('expired') || code === 'token_expired') {
		if (message.includes('reset')) return 'expired_reset_link';
		if (message.includes('verification') || message.includes('confirm'))
			return 'expired_verification_link';
		return 'session_expired';
	}

	if (message.includes('network') || message.includes('fetch')) {
		return 'network_error';
	}

	if (code >= 500 || message.includes('server error')) {
		return 'server_error';
	}

	if (message.includes('unauthorized') || code === 401) {
		return 'unauthorized';
	}

	if (message.includes('locked') || message.includes('too many')) {
		return 'account_locked';
	}

	return 'auth_error';
}
