import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'svelte-sonner';
import { 
	authToasts, 
	handleSupabaseAuthError, 
	handleFormValidationError, 
	handleFormSuccess 
} from '../auth-toasts';

// Mock svelte-sonner
vi.mock('svelte-sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warning: vi.fn()
	}
}));

describe('Auth Toasts Utility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('authToasts.success', () => {
		it('should show login success toast', () => {
			authToasts.success.login();
			expect(toast.success).toHaveBeenCalledWith('Welcome back! You\'ve been logged in successfully.');
		});

		it('should show register success toast', () => {
			authToasts.success.register();
			expect(toast.success).toHaveBeenCalledWith('Account created successfully! Please check your email to verify your account.');
		});

		it('should show logout success toast', () => {
			authToasts.success.logout();
			expect(toast.success).toHaveBeenCalledWith('You\'ve been logged out successfully. See you soon!');
		});

		it('should show password reset request toast', () => {
			authToasts.success.passwordResetRequest();
			expect(toast.info).toHaveBeenCalledWith('Password reset email sent! Check your inbox for further instructions.');
		});

		it('should show password reset success toast', () => {
			authToasts.success.passwordResetSuccess();
			expect(toast.success).toHaveBeenCalledWith('Password updated successfully! You can now log in with your new password.');
		});

		it('should show email verification success toast', () => {
			authToasts.success.emailVerification();
			expect(toast.success).toHaveBeenCalledWith('Email verified successfully! You can now access all features.');
		});

		it('should show profile update success toast', () => {
			authToasts.success.profileUpdate();
			expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
		});
	});

	describe('authToasts.error', () => {
		it('should show invalid credentials error toast', () => {
			authToasts.error.invalidCredentials();
			expect(toast.error).toHaveBeenCalledWith('Invalid email or password. Please check your credentials and try again.');
		});

		it('should show email not confirmed error toast', () => {
			authToasts.error.emailNotConfirmed();
			expect(toast.error).toHaveBeenCalledWith('Please verify your email address before signing in. Check your inbox for the verification link.');
		});

		it('should show too many requests error toast', () => {
			authToasts.error.tooManyRequests();
			expect(toast.error).toHaveBeenCalledWith('Too many attempts. Please wait a moment before trying again.');
		});

		it('should show user not found error toast', () => {
			authToasts.error.userNotFound();
			expect(toast.error).toHaveBeenCalledWith('No account found with this email address.');
		});

		it('should show email already exists error toast', () => {
			authToasts.error.emailAlreadyExists();
			expect(toast.error).toHaveBeenCalledWith('An account with this email already exists. Try logging in instead.');
		});

		it('should show weak password error toast', () => {
			authToasts.error.weakPassword();
			expect(toast.error).toHaveBeenCalledWith('Password is too weak. Please choose a stronger password.');
		});

		it('should show invalid email error toast', () => {
			authToasts.error.invalidEmail();
			expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address.');
		});

		it('should show password reset failed error toast', () => {
			authToasts.error.passwordResetFailed();
			expect(toast.error).toHaveBeenCalledWith('Failed to send password reset email. Please try again.');
		});

		it('should show invalid reset token error toast', () => {
			authToasts.error.invalidResetToken();
			expect(toast.error).toHaveBeenCalledWith('Invalid or expired reset link. Please request a new password reset.');
		});

		it('should show password update failed error toast', () => {
			authToasts.error.passwordUpdateFailed();
			expect(toast.error).toHaveBeenCalledWith('Failed to update password. Please try again.');
		});

		it('should show network error toast', () => {
			authToasts.error.networkError();
			expect(toast.error).toHaveBeenCalledWith('Network error. Please check your connection and try again.');
		});

		it('should show server error toast', () => {
			authToasts.error.serverError();
			expect(toast.error).toHaveBeenCalledWith('Something went wrong on our end. Please try again later.');
		});

		it('should show validation error toast', () => {
			authToasts.error.validationError();
			expect(toast.error).toHaveBeenCalledWith('Please fix the errors in the form before submitting.');
		});

		it('should show unexpected error toast', () => {
			authToasts.error.unexpectedError();
			expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
		});
	});

	describe('authToasts.warning', () => {
		it('should show session expiring warning toast', () => {
			authToasts.warning.sessionExpiring();
			expect(toast.warning).toHaveBeenCalledWith('Your session will expire soon. Please save your work.');
		});

		it('should show email not verified warning toast', () => {
			authToasts.warning.emailNotVerified();
			expect(toast.warning).toHaveBeenCalledWith('Please verify your email to access all features.');
		});
	});

	describe('handleSupabaseAuthError', () => {
		it('should handle invalid login credentials error', () => {
			handleSupabaseAuthError({ message: 'Invalid login credentials' });
			expect(toast.error).toHaveBeenCalledWith('Invalid email or password. Please check your credentials and try again.');
		});

		it('should handle email not confirmed error', () => {
			handleSupabaseAuthError({ message: 'Email not confirmed' });
			expect(toast.error).toHaveBeenCalledWith('Please verify your email address before signing in. Check your inbox for the verification link.');
		});

		it('should handle too many requests error', () => {
			handleSupabaseAuthError({ message: 'Too many requests', status: 429 });
			expect(toast.error).toHaveBeenCalledWith('Too many attempts. Please wait a moment before trying again.');
		});

		it('should handle user not found error', () => {
			handleSupabaseAuthError({ message: 'User not found' });
			expect(toast.error).toHaveBeenCalledWith('No account found with this email address.');
		});

		it('should handle user already registered error', () => {
			handleSupabaseAuthError({ message: 'User already registered' });
			expect(toast.error).toHaveBeenCalledWith('An account with this email already exists. Try logging in instead.');
		});

		it('should handle weak password error', () => {
			handleSupabaseAuthError({ message: 'Password is too weak' });
			expect(toast.error).toHaveBeenCalledWith('Password is too weak. Please choose a stronger password.');
		});

		it('should handle invalid email error', () => {
			handleSupabaseAuthError({ message: 'Invalid email format' });
			expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address.');
		});

		it('should handle password reset error', () => {
			handleSupabaseAuthError({ message: 'Password reset failed' });
			expect(toast.error).toHaveBeenCalledWith('Failed to send password reset email. Please try again.');
		});

		it('should handle invalid token error', () => {
			handleSupabaseAuthError({ message: 'Invalid token provided' });
			expect(toast.error).toHaveBeenCalledWith('Invalid or expired reset link. Please request a new password reset.');
		});

		it('should handle network error', () => {
			handleSupabaseAuthError({ message: 'Network fetch failed' });
			expect(toast.error).toHaveBeenCalledWith('Network error. Please check your connection and try again.');
		});

		it('should handle server error with status code', () => {
			handleSupabaseAuthError({ message: 'Internal server error', status: 500 });
			expect(toast.error).toHaveBeenCalledWith('Something went wrong on our end. Please try again later.');
		});

		it('should handle unknown error with default message', () => {
			handleSupabaseAuthError({ message: 'Unknown error occurred' });
			expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
		});

		it('should be case insensitive when matching error messages', () => {
			handleSupabaseAuthError({ message: 'INVALID LOGIN CREDENTIALS' });
			expect(toast.error).toHaveBeenCalledWith('Invalid email or password. Please check your credentials and try again.');
		});
	});

	describe('handleFormValidationError', () => {
		it('should show validation error toast when hasErrors is true', () => {
			handleFormValidationError(true);
			expect(toast.error).toHaveBeenCalledWith('Please fix the errors in the form before submitting.');
		});

		it('should show validation error toast when hasErrors is not provided (defaults to true)', () => {
			handleFormValidationError();
			expect(toast.error).toHaveBeenCalledWith('Please fix the errors in the form before submitting.');
		});

		it('should not show toast when hasErrors is false', () => {
			handleFormValidationError(false);
			expect(toast.error).not.toHaveBeenCalled();
		});
	});

	describe('handleFormSuccess', () => {
		it('should show success toast for login type', () => {
			handleFormSuccess('login');
			expect(toast.success).toHaveBeenCalledWith('Welcome back! You\'ve been logged in successfully.');
		});

		it('should show success toast for register type', () => {
			handleFormSuccess('register');
			expect(toast.success).toHaveBeenCalledWith('Account created successfully! Please check your email to verify your account.');
		});

		it('should show success toast for passwordResetRequest type', () => {
			handleFormSuccess('passwordResetRequest');
			expect(toast.info).toHaveBeenCalledWith('Password reset email sent! Check your inbox for further instructions.');
		});

		it('should show success toast for passwordResetSuccess type', () => {
			handleFormSuccess('passwordResetSuccess');
			expect(toast.success).toHaveBeenCalledWith('Password updated successfully! You can now log in with your new password.');
		});

		it('should show custom message when provided', () => {
			const customMessage = 'Custom success message';
			handleFormSuccess('login', customMessage);
			expect(toast.success).toHaveBeenCalledWith(customMessage);
		});

		it('should show success toast for emailVerification type', () => {
			handleFormSuccess('emailVerification');
			expect(toast.success).toHaveBeenCalledWith('Email verified successfully! You can now access all features.');
		});

		it('should show success toast for profileUpdate type', () => {
			handleFormSuccess('profileUpdate');
			expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
		});

		it('should show success toast for logout type', () => {
			handleFormSuccess('logout');
			expect(toast.success).toHaveBeenCalledWith('You\'ve been logged out successfully. See you soon!');
		});
	});
});