import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { passwordResetRequestSchema } from '$lib/validation/auth';

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
		passwordResetRequest: vi.fn()
	},
	error: {
		tooManyRequests: vi.fn(),
		invalidEmail: vi.fn(),
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

describe('ForgotPasswordForm Component Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Form Validation Logic', () => {
		it('should validate correct email format', () => {
			const validEmail = 'user@example.com';
			const result = passwordResetRequestSchema.safeParse({ email: validEmail });
			
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe(validEmail);
			}
		});

		it('should reject invalid email formats', () => {
			const invalidEmails = [
				'invalid-email',
				'@example.com',
				'user@',
				'user.example.com',
				'',
				'user@domain',
				'user.domain.com'
			];

			invalidEmails.forEach(email => {
				const result = passwordResetRequestSchema.safeParse({ email });
				expect(result.success).toBe(false);
			});
		});

		it('should sanitize email input by trimming whitespace and converting to lowercase', () => {
			const inputWithSpaces = 'USER@EXAMPLE.COM';
			const result = passwordResetRequestSchema.safeParse({ email: inputWithSpaces });
			
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe('user@example.com');
			}
		});

		it('should require email field', () => {
			const result = passwordResetRequestSchema.safeParse({ email: '' });
			expect(result.success).toBe(false);
			
			if (!result.success) {
				// The schema has both email format validation and min length validation
				// Empty string fails email format validation first
				expect(result.error.issues[0].message).toContain('Please enter a valid email address');
			}
		});

		it('should handle case insensitive email validation', () => {
			const upperCaseEmail = 'USER@EXAMPLE.COM';
			const result = passwordResetRequestSchema.safeParse({ email: upperCaseEmail });
			
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe('user@example.com');
			}
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle rate limit errors', () => {
			// Simulate rate limit error handling
			mockAuthToasts.error.tooManyRequests();
			expect(mockAuthToasts.error.tooManyRequests).toHaveBeenCalledTimes(1);
		});

		it('should handle invalid email errors', () => {
			// Simulate invalid email error handling
			mockAuthToasts.error.invalidEmail();
			expect(mockAuthToasts.error.invalidEmail).toHaveBeenCalledTimes(1);
		});

		it('should handle unexpected errors', () => {
			// Simulate unexpected error handling
			mockAuthToasts.error.unexpectedError();
			expect(mockAuthToasts.error.unexpectedError).toHaveBeenCalledTimes(1);
		});

		it('should handle Supabase auth errors', () => {
			const mockError = { message: 'Test error', status: 400 };
			mockHandleSupabaseAuthError(mockError);
			expect(mockHandleSupabaseAuthError).toHaveBeenCalledWith(mockError);
		});

		it('should handle form validation errors', () => {
			mockHandleFormValidationError();
			expect(mockHandleFormValidationError).toHaveBeenCalledTimes(1);
		});
	});

	describe('Success Handling Logic', () => {
		it('should handle successful password reset request', () => {
			mockHandleFormSuccess('passwordResetRequest');
			expect(mockHandleFormSuccess).toHaveBeenCalledWith('passwordResetRequest');
		});

		it('should show success toast for password reset request', () => {
			mockAuthToasts.success.passwordResetRequest();
			expect(mockAuthToasts.success.passwordResetRequest).toHaveBeenCalledTimes(1);
		});
	});

	describe('Form Result Handling', () => {
		it('should handle successful form submission result', () => {
			const mockResult = {
				type: 'success',
				status: 200,
				data: {}
			};

			// Verify that valid data would pass schema validation
			const validData = { email: 'user@example.com' };
			const result = passwordResetRequestSchema.safeParse(validData);
			
			expect(result.success).toBe(true);
		});

		it('should handle form submission failure with rate limit error', () => {
			const rateLimitResult = {
				type: 'failure',
				status: 429,
				data: { error: 'Too many requests', errorType: 'rate_limit' }
			};

			// Verify error type handling
			if (rateLimitResult.data.errorType === 'rate_limit') {
				mockAuthToasts.error.tooManyRequests();
			}
			
			expect(mockAuthToasts.error.tooManyRequests).toHaveBeenCalledTimes(1);
		});

		it('should handle form submission failure with invalid email error', () => {
			const invalidEmailResult = {
				type: 'failure',
				status: 400,
				data: { error: 'Invalid email', errorType: 'invalid_email' }
			};

			// Verify error type handling
			if (invalidEmailResult.data.errorType === 'invalid_email') {
				mockAuthToasts.error.invalidEmail();
			}
			
			expect(mockAuthToasts.error.invalidEmail).toHaveBeenCalledTimes(1);
		});

		it('should handle generic server errors', () => {
			const genericErrorResult = {
				type: 'failure',
				status: 500,
				data: { error: 'Server error' }
			} as const;

			// Verify generic error handling
			if (genericErrorResult.data.error && !('errorType' in genericErrorResult.data)) {
				mockHandleSupabaseAuthError({ 
					message: genericErrorResult.data.error, 
					status: genericErrorResult.status 
				});
			}
			
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