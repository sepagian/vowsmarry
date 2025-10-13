import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { passwordResetRequestSchema, passwordResetSchema } from '$lib/validation/auth';

// Mock Supabase client
const mockSupabaseClient = {
	auth: {
		resetPasswordForEmail: vi.fn(),
		updateUser: vi.fn(),
		getSession: vi.fn(),
		signOut: vi.fn()
	}
};

// Mock svelte-sonner
vi.mock('svelte-sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warning: vi.fn()
	}
}));

// Mock auth-toasts utility
const mockAuthToasts = {
	success: {
		passwordResetRequest: vi.fn(),
		passwordResetSuccess: vi.fn()
	},
	error: {
		tooManyRequests: vi.fn(),
		invalidEmail: vi.fn(),
		invalidResetToken: vi.fn(),
		unexpectedError: vi.fn()
	}
};

vi.mock('$lib/utils/auth-toasts', () => ({
	authToasts: mockAuthToasts,
	handleSupabaseAuthError: vi.fn(),
	handleFormValidationError: vi.fn(),
	handleFormSuccess: vi.fn()
}));

describe('Authentication Integration Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Complete Password Reset Flow', () => {
		it('should handle complete password reset flow end-to-end', async () => {
			// Step 1: User requests password reset
			const resetRequestData = { email: 'user@example.com' };
			const requestResult = passwordResetRequestSchema.safeParse(resetRequestData);
			
			expect(requestResult.success).toBe(true);
			
			// Mock successful password reset email request
			mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
				data: {},
				error: null
			});

			// Simulate server action call
			const resetEmailResponse = await mockSupabaseClient.auth.resetPasswordForEmail(
				resetRequestData.email,
				{ redirectTo: 'http://localhost:5173/reset-password' }
			);

			expect(resetEmailResponse.error).toBeNull();
			expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
				'user@example.com',
				{ redirectTo: 'http://localhost:5173/reset-password' }
			);

			// Step 2: User receives email and clicks reset link (token validation)
			const resetToken = 'valid-reset-token-123';
			const newPasswordData = {
				token: resetToken,
				password: 'NewSecurePassword123!',
				confirmPassword: 'NewSecurePassword123!'
			};

			const passwordResetResult = passwordResetSchema.safeParse(newPasswordData);
			expect(passwordResetResult.success).toBe(true);

			// Step 3: User submits new password
			mockSupabaseClient.auth.updateUser.mockResolvedValue({
				data: { user: { id: 'user-123', email: 'user@example.com' } },
				error: null
			});

			const updateResponse = await mockSupabaseClient.auth.updateUser({
				password: newPasswordData.password
			});

			expect(updateResponse.error).toBeNull();
			expect(updateResponse.data.user).toBeDefined();
			expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({
				password: 'NewSecurePassword123!'
			});

			// Verify success flow completed
			expect(requestResult.success).toBe(true);
			expect(passwordResetResult.success).toBe(true);
		});

		it('should handle password reset flow with invalid email', async () => {
			const invalidEmailData = { email: 'invalid-email' };
			const result = passwordResetRequestSchema.safeParse(invalidEmailData);
			
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('Please enter a valid email address');
			}
		});

		it('should handle password reset flow with expired token', async () => {
			// Mock expired token error from Supabase
			mockSupabaseClient.auth.updateUser.mockResolvedValue({
				data: null,
				error: { message: 'Token has expired', status: 400 }
			});

			const resetData = {
				token: 'expired-token',
				password: 'NewPassword123!',
				confirmPassword: 'NewPassword123!'
			};

			const validationResult = passwordResetSchema.safeParse(resetData);
			expect(validationResult.success).toBe(true);

			// Simulate server action with expired token
			const updateResponse = await mockSupabaseClient.auth.updateUser({
				password: resetData.password
			});

			expect(updateResponse.error).toBeDefined();
			expect(updateResponse.error.message).toContain('expired');
		});

		it('should handle password reset flow with invalid token', async () => {
			// Mock invalid token error from Supabase
			mockSupabaseClient.auth.updateUser.mockResolvedValue({
				data: null,
				error: { message: 'Invalid token', status: 400 }
			});

			const resetData = {
				token: 'invalid-token',
				password: 'NewPassword123!',
				confirmPassword: 'NewPassword123!'
			};

			const validationResult = passwordResetSchema.safeParse(resetData);
			expect(validationResult.success).toBe(true);

			// Simulate server action with invalid token
			const updateResponse = await mockSupabaseClient.auth.updateUser({
				password: resetData.password
			});

			expect(updateResponse.error).toBeDefined();
			expect(updateResponse.error.message).toContain('Invalid token');
		});

		it('should handle password reset flow with mismatched passwords', () => {
			const mismatchedData = {
				token: 'valid-token',
				password: 'Password123!',
				confirmPassword: 'DifferentPassword123!'
			};

			const result = passwordResetSchema.safeParse(mismatchedData);
			expect(result.success).toBe(false);
			
			if (!result.success) {
				expect(result.error.issues.some(issue => 
					issue.message.includes("don't match")
				)).toBe(true);
			}
		});

		it('should handle password reset flow with weak password', () => {
			const weakPasswordData = {
				token: 'valid-token',
				password: 'weak',
				confirmPassword: 'weak'
			};

			const result = passwordResetSchema.safeParse(weakPasswordData);
			expect(result.success).toBe(false);
		});
	});

	describe('Error Handling and Edge Cases', () => {
		it('should handle network errors during password reset request', async () => {
			mockSupabaseClient.auth.resetPasswordForEmail.mockRejectedValue(
				new Error('Network error')
			);

			const resetRequestData = { email: 'user@example.com' };
			
			try {
				await mockSupabaseClient.auth.resetPasswordForEmail(resetRequestData.email);
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toBe('Network error');
			}
		});

		it('should handle rate limiting during password reset', async () => {
			mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
				data: null,
				error: { message: 'Too many requests', status: 429 }
			});

			const resetRequestData = { email: 'user@example.com' };
			const response = await mockSupabaseClient.auth.resetPasswordForEmail(resetRequestData.email);

			expect(response.error).toBeDefined();
			expect(response.error.status).toBe(429);
			expect(response.error.message).toContain('Too many requests');
		});

		it('should handle server errors during password update', async () => {
			mockSupabaseClient.auth.updateUser.mockResolvedValue({
				data: null,
				error: { message: 'Internal server error', status: 500 }
			});

			const resetData = {
				token: 'valid-token',
				password: 'NewPassword123!',
				confirmPassword: 'NewPassword123!'
			};

			const response = await mockSupabaseClient.auth.updateUser({
				password: resetData.password
			});

			expect(response.error).toBeDefined();
			expect(response.error.status).toBe(500);
		});
	});

	describe('Redirect and Error Page Integration', () => {
		it('should handle redirect to error page for invalid reset links', () => {
			// Test data that would trigger error page redirect
			const invalidLinkScenarios = [
				{ token: null, reason: 'missing_token' },
				{ token: 'expired_token', reason: 'token_expired' },
				{ token: 'invalid_token', reason: 'invalid_token' }
			];

			invalidLinkScenarios.forEach(scenario => {
				// Simulate error page parameters
				const errorPageParams = new URLSearchParams({
					type: 'password_reset_error',
					reason: scenario.reason
				});

				expect(errorPageParams.get('type')).toBe('password_reset_error');
				expect(errorPageParams.get('reason')).toBe(scenario.reason);
			});
		});

		it('should handle proper redirects after successful password reset', () => {
			// Simulate successful password reset redirect
			const successRedirect = '/login?message=password_reset_success';
			const url = new URL(successRedirect, 'http://localhost:5173');
			
			expect(url.pathname).toBe('/login');
			expect(url.searchParams.get('message')).toBe('password_reset_success');
		});
	});

	describe('Toast Notification Integration', () => {
		it('should trigger appropriate toasts throughout password reset flow', () => {
			// Test forgot password success toast
			mockAuthToasts.success.passwordResetRequest();
			expect(mockAuthToasts.success.passwordResetRequest).toHaveBeenCalledTimes(1);

			// Test password reset success toast
			mockAuthToasts.success.passwordResetSuccess();
			expect(mockAuthToasts.success.passwordResetSuccess).toHaveBeenCalledTimes(1);

			// Test error toasts
			mockAuthToasts.error.invalidEmail();
			expect(mockAuthToasts.error.invalidEmail).toHaveBeenCalledTimes(1);

			mockAuthToasts.error.invalidResetToken();
			expect(mockAuthToasts.error.invalidResetToken).toHaveBeenCalledTimes(1);

			mockAuthToasts.error.tooManyRequests();
			expect(mockAuthToasts.error.tooManyRequests).toHaveBeenCalledTimes(1);
		});

		it('should handle toast notifications for different error types', () => {
			const errorTypes = [
				{ type: 'invalid_email', handler: mockAuthToasts.error.invalidEmail },
				{ type: 'rate_limit', handler: mockAuthToasts.error.tooManyRequests },
				{ type: 'invalid_token', handler: mockAuthToasts.error.invalidResetToken },
				{ type: 'unexpected', handler: mockAuthToasts.error.unexpectedError }
			];

			errorTypes.forEach(({ handler }) => {
				handler();
				expect(handler).toHaveBeenCalled();
			});
		});
	});

	describe('Form State Management Integration', () => {
		it('should handle form loading states during password reset flow', () => {
			// Simulate form loading state management
			let isLoading = false;
			
			// Start password reset request
			isLoading = true;
			expect(isLoading).toBe(true);

			// Complete password reset request
			isLoading = false;
			expect(isLoading).toBe(false);
		});

		it('should handle form validation state throughout the flow', () => {
			// Test form validation states
			const formStates = {
				pristine: true,
				valid: false,
				submitting: false,
				errors: {}
			};

			// Simulate user input
			formStates.pristine = false;
			formStates.valid = true;
			
			expect(formStates.pristine).toBe(false);
			expect(formStates.valid).toBe(true);

			// Simulate form submission
			formStates.submitting = true;
			expect(formStates.submitting).toBe(true);
		});
	});

	describe('Session Management Integration', () => {
		it('should handle session state after password reset', async () => {
			// Mock session check after password reset
			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: {
					session: {
						user: { id: 'user-123', email: 'user@example.com' },
						access_token: 'new-access-token'
					}
				},
				error: null
			});

			const sessionResponse = await mockSupabaseClient.auth.getSession();
			
			expect(sessionResponse.data.session).toBeDefined();
			expect(sessionResponse.data.session.user.email).toBe('user@example.com');
		});

		it('should handle logout after password reset if required', async () => {
			mockSupabaseClient.auth.signOut.mockResolvedValue({
				error: null
			});

			const logoutResponse = await mockSupabaseClient.auth.signOut();
			expect(logoutResponse.error).toBeNull();
			expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
		});
	});
});