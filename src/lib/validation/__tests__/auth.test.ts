import { describe, it, expect } from 'vitest';
import {
	loginSchema,
	registrationSchema,
	passwordResetRequestSchema,
	passwordResetSchema,
	changePasswordSchema,
	profileUpdateSchema,
	emailVerificationSchema
} from '../auth.js';

describe('Authentication Schemas', () => {
	describe('loginSchema', () => {
		it('should validate correct login data', () => {
			const validData = {
				email: 'user@example.com',
				password: 'password123'
			};
			
			const result = loginSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe('user@example.com');
				expect(result.data.password).toBe('password123');
			}
		});

		it('should reject invalid email', () => {
			const invalidData = {
				email: 'invalid-email',
				password: 'password123'
			};
			
			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should reject empty password', () => {
			const invalidData = {
				email: 'user@example.com',
				password: ''
			};
			
			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('registrationSchema', () => {
		it('should validate correct registration data', () => {
			const validData = {
				email: 'user@example.com',
				password: 'Password123',
				confirmPassword: 'Password123',
				firstName: 'John',
				lastName: 'Doe'
			};
			
			const result = registrationSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe('user@example.com');
				expect(result.data.firstName).toBe('John');
				expect(result.data.lastName).toBe('Doe');
			}
		});

		it('should reject weak password', () => {
			const invalidData = {
				email: 'user@example.com',
				password: 'weak',
				confirmPassword: 'weak',
				firstName: 'John',
				lastName: 'Doe'
			};
			
			const result = registrationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should reject mismatched passwords', () => {
			const invalidData = {
				email: 'user@example.com',
				password: 'Password123',
				confirmPassword: 'Password456',
				firstName: 'John',
				lastName: 'Doe'
			};
			
			const result = registrationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.some(issue => 
					issue.path.includes('confirmPassword') && 
					issue.message.includes("don't match")
				)).toBe(true);
			}
		});

		it('should reject short names', () => {
			const invalidData = {
				email: 'user@example.com',
				password: 'Password123',
				confirmPassword: 'Password123',
				firstName: 'J',
				lastName: 'D'
			};
			
			const result = registrationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('passwordResetRequestSchema', () => {
		it('should validate correct email', () => {
			const validData = {
				email: 'user@example.com'
			};
			
			const result = passwordResetRequestSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject invalid email', () => {
			const invalidData = {
				email: 'invalid-email'
			};
			
			const result = passwordResetRequestSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('passwordResetSchema', () => {
		it('should validate correct reset data', () => {
			const validData = {
				token: 'reset-token-123',
				password: 'NewPassword123',
				confirmPassword: 'NewPassword123'
			};
			
			const result = passwordResetSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject mismatched passwords', () => {
			const invalidData = {
				token: 'reset-token-123',
				password: 'NewPassword123',
				confirmPassword: 'DifferentPassword123'
			};
			
			const result = passwordResetSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('changePasswordSchema', () => {
		it('should validate correct password change data', () => {
			const validData = {
				currentPassword: 'OldPassword123',
				newPassword: 'NewPassword123',
				confirmNewPassword: 'NewPassword123'
			};
			
			const result = changePasswordSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject same old and new password', () => {
			const invalidData = {
				currentPassword: 'SamePassword123',
				newPassword: 'SamePassword123',
				confirmNewPassword: 'SamePassword123'
			};
			
			const result = changePasswordSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.some(issue => 
					issue.message.includes('must be different from current password')
				)).toBe(true);
			}
		});
	});

	describe('profileUpdateSchema', () => {
		it('should validate correct profile data', () => {
			const validData = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com'
			};
			
			const result = profileUpdateSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should sanitize and transform data', () => {
			const inputData = {
				firstName: '  John  ',
				lastName: '  Doe  ',
				email: '  JOHN.DOE@EXAMPLE.COM  '
			};
			
			const result = profileUpdateSchema.safeParse(inputData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.firstName).toBe('John');
				expect(result.data.lastName).toBe('Doe');
				expect(result.data.email).toBe('john.doe@example.com');
			}
		});
	});

	describe('emailVerificationSchema', () => {
		it('should validate correct verification data', () => {
			const validData = {
				token: 'verification-token-123',
				email: 'user@example.com'
			};
			
			const result = emailVerificationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should reject empty token', () => {
			const invalidData = {
				token: '',
				email: 'user@example.com'
			};
			
			const result = emailVerificationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});