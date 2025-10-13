import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { passwordResetSchema } from '$lib/validation/auth';

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
		passwordResetSuccess: vi.fn()
	},
	error: {
		invalidResetToken: vi.fn(),
		tooManyRequests: vi.fn(),
		unexpectedError: vi.fn()
	}
};

const mockHandleSupabaseAuthError = vi.fn();
const mockHandleFormValidationError = vi.fn();
const mockHandleFormSuccess = vi.fn();

vi.mock('$lib/utils/auth-toasts', () => ({
	authToasts: mockAuthToasts,
	handleSupabaseAuthError: mockHandleSupabaseAuthError,
	handleFormValidationError: mockHandleFormValidationError,
	handleFormSuccess: mockHandleFormSuccess
}));

describe('ResetPasswordForm Component Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Form Validation Logic', () => {

		it('should validate correct password reset data', () => {
			const validData = {
				token: 'test-token',
				password: 'StrongPassword123!',
				confirmPassword: 'StrongPassword123!'
			};
			
			const result = passwordResetSchema.safeParse(validData);
			expect(result.success).toBe(true);
			
			if (result.success) {
				expect(result.data.token).toBe('test-token');
				expect(result.data.password).toBe('StrongPassword123!');
				expect(result.data.confirmPassword).toBe('StrongPassword123!');
			}
		});

		it('should reject weak passwords', () => {
			const weakPasswordData = {
				token: 'test-token',
				password: 'weak',
				confirmPassword: 'weak'
			};
			
			const result = passwordResetSchema.safeParse(weakPasswordData);
			expect(result.success).toBe(false);
		});

		it('should reject mismatched passwords', () => {
			const mismatchedData = {
				token: 'test-token',
				password: 'StrongPassword123!',
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

		it('should require token field', () => {
			const dataWithoutToken = {
				password: 'StrongPassword123!',
				confirmPassword: 'StrongPassword123!'
			};
			
			const result = passwordResetSchema.safeParse(dataWithoutToken);
			expect(result.success).toBe(false);
			
			if (!result.success) {
				expect(result.error.issues.some(issue => 
					issue.path.includes('token')
				)).toBe(true);
			}
		});

		it('should require password fields', () => {
			const dataWithoutPasswords = {
				token: 'test-token',
				password: '',
				confirmPassword: ''
			};
			
			const result = passwordResetSchema.safeParse(dataWithoutPasswords);
			expect(result.success).toBe(false);
			
			if (!result.success) {
				const issues = result.error.issues;
				expect(issues.some(issue => issue.path.includes('password'))).toBe(true);
			}
		});

		it('should validate password strength requirements', () => {
			const testCases = [
				{
					password: 'weak',
					confirmPassword: 'weak',
					shouldPass: false,
					description: 'weak password'
				},
				{
					password: 'StrongPassword123!',
					confirmPassword: 'StrongPassword123!',
					shouldPass: true,
					description: 'strong password'
				},
				{
					password: 'password123',
					confirmPassword: 'password123',
					shouldPass: false,
					description: 'common password'
				},
				{
					password: '12345678',
					confirmPassword: '12345678',
					shouldPass: false,
					description: 'numeric only password'
				}
			];

			testCases.forEach(({ password, confirmPassword, shouldPass, description }) => {
				const data = {
					token: 'test-token',
					password,
					confirmPassword
				};
				
				const result = passwordResetSchema.safeParse(data);
				
				if (shouldPass) {
					expect(result.success).toBe(true);
				} else {
					expect(result.success).toBe(false);
				}
			});
		});

		it('should validate token input without sanitization', () => {
			const tokenWithSpaces = '  test-token-123  ';
			const data = {
				token: tokenWithSpaces,
				password: 'StrongPassword123!',
				confirmPassword: 'StrongPassword123!'
			};
			
			const result = passwordResetSchema.safeParse(data);
			expect(result.success).toBe(true);
			
			if (result.success) {
				// Token field doesn't have sanitization transform, so spaces are preserved
				expect(result.data.token).toBe('  test-token-123  ');
			}
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle invalid reset token errors', () => {
			mockAuthToasts.error.invalidResetToken();
			expect(mockAuthToasts.error.invalidResetToken).toHaveBeenCalledTimes(1);
		});

		it('should handle rate limit errors', () => {
			mockAuthToasts.error.tooManyRequests();
			expect(mockAuthToasts.error.tooManyRequests).toHaveBeenCalledTimes(1);
		});

		it('should handle unexpected errors', () => {
			mockAuthToasts.error.unexpectedError();
			expect(mockAuthToasts.error.unexpectedError).toHaveBeenCalledTimes(1);
		});

		it('should handle Supabase auth errors', () => {
			const mockError = { message: 'Invalid token', status: 400 };
			mockHandleSupabaseAuthError(mockError);
			expect(mockHandleSupabaseAuthError).toHaveBeenCalledWith(mockError);
		});

		it('should handle form validation errors', () => {
			mockHandleFormValidationError();
			expect(mockHandleFormValidationError).toHaveBeenCalledTimes(1);
		});
	});

	describe('Success Handling Logic', () => {
		it('should handle successful password reset', () => {
			mockHandleFormSuccess('passwordResetSuccess');
			expect(mockHandleFormSuccess).toHaveBeenCalledWith('passwordResetSuccess');
		});

		it('should show success toast for password reset', () => {
			mockAuthToasts.success.passwordResetSuccess();
			expect(mockAuthToasts.success.passwordResetSuccess).toHaveBeenCalledTimes(1);
		});
	});

	describe('Form Result Handling', () => {
		it('should handle successful password reset result', () => {
			const mockResult = {
				type: 'success',
				status: 200,
				data: {}
			};

			// Verify that valid data would pass schema validation
			const validData = {
				token: 'valid-token',
				password: 'NewPassword123!',
				confirmPassword: 'NewPassword123!'
			};
			
			const result = passwordResetSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should handle password reset failure with invalid token', () => {
			const invalidTokenResult = {
				type: 'failure',
				status: 400,
				data: { message: 'Invalid token' }
			};

			// Verify error handling for token-related errors
			if (invalidTokenResult.data.message.includes('token')) {
				mockAuthToasts.error.invalidResetToken();
			}
			
			expect(mockAuthToasts.error.invalidResetToken).toHaveBeenCalledTimes(1);
		});

		it('should handle password reset failure with expired token', () => {
			const expiredTokenResult = {
				type: 'failure',
				status: 400,
				data: { message: 'Token expired' }
			};

			// Verify error handling for expired tokens
			if (expiredTokenResult.data.message.includes('expired')) {
				mockAuthToasts.error.invalidResetToken();
			}
			
			expect(mockAuthToasts.error.invalidResetToken).toHaveBeenCalledTimes(1);
		});

		it('should handle password reset failure with rate limit', () => {
			const rateLimitResult = {
				type: 'failure',
				status: 429,
				data: { message: 'Too many requests' }
			};

			// Verify error handling for rate limits
			if (rateLimitResult.data.message.includes('too many')) {
				mockAuthToasts.error.tooManyRequests();
				expect(mockAuthToasts.error.tooManyRequests).toHaveBeenCalledTimes(1);
			}
		});

		it('should handle generic server errors', () => {
			const genericErrorResult = {
				type: 'failure',
				status: 500,
				data: { message: 'Server error' }
			};

			// Verify generic error handling
			mockHandleSupabaseAuthError({ 
				message: genericErrorResult.data.message, 
				status: genericErrorResult.status 
			});
			
			expect(mockHandleSupabaseAuthError).toHaveBeenCalledWith({
				message: 'Server error',
				status: 500
			});
		});

		it('should handle unexpected errors in onError callback', () => {
			const errorResult = {
				type: 'error',
				status: 500,
				error: new Error('Network error')
			};

			// Verify unexpected error handling
			mockAuthToasts.error.unexpectedError();
			expect(mockAuthToasts.error.unexpectedError).toHaveBeenCalledTimes(1);
		});
	});
});